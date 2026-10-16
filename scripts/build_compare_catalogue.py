#!/usr/bin/env python3
"""Build a compact comparison listing payload and on-demand price-history pages."""
import argparse
import json
import math
from pathlib import Path
from catalogue_brands import normalise_brand
from tempfile import TemporaryDirectory

ROOT = Path(__file__).resolve().parents[1]
HISTORY_PAGE_SIZE = 100
PRODUCT_FIELDS = frozenset({
    "id", "name", "brand", "retailer", "url", "type", "colour", "colourHex",
    "image", "imageNote", "price", "shippingPrice", "pack", "unit",
    "availability", "updated", "lastCheckStatus", "category", "weightGrams",
})
SUMMARY_FIELDS = ("currency", "updatedAt", "refreshPolicy", "lastRefreshSummary", "sources", "brandDirectory")


def compact_json(value):
    return json.dumps(json_safe(value), ensure_ascii=False, separators=(",", ":"), allow_nan=False) + "\n"


def json_safe(value):
    """Replace non-finite crawler values so output stays valid JSON/JavaScript."""
    if isinstance(value, float) and not math.isfinite(value):
        return None
    if isinstance(value, dict):
        return {key: json_safe(item) for key, item in value.items()}
    if isinstance(value, list):
        return [json_safe(item) for item in value]
    return value


def compact_js_global(name, value):
    payload = json.dumps(json_safe(value), ensure_ascii=False, separators=(",", ":"), allow_nan=False)
    payload = payload.replace("<", "\\u003c").replace("\u2028", "\\u2028").replace("\u2029", "\\u2029")
    return "window." + name + "=" + payload + ";\n"


def _price_key(product):
    try:
        value = float(product.get("price"))
        return (value if math.isfinite(value) else math.inf, str(product.get("id", "")))
    except (TypeError, ValueError):
        return (math.inf, str(product.get("id", "")))


def build_catalogue(data, history_page_size=HISTORY_PAGE_SIZE):
    products = data.get("products")
    if not isinstance(products, list) or not products:
        raise ValueError("The comparison catalogue must contain products")
    if not isinstance(history_page_size, int) or history_page_size < 1:
        raise ValueError("Price-history page size must be a positive integer")

    # Removed offers remain in the source/history archive, outside current results.
    ordered = sorted((product for product in products if not product.get('sourceUnavailable')), key=_price_key)
    seen = set()
    summary_products = []
    history_pages = {}
    for index, product in enumerate(ordered):
        if not isinstance(product, dict):
            raise ValueError("Every product listing must be an object")
        product_id = str(product.get("id", "")).strip()
        if not product_id or product_id in seen:
            raise ValueError("Every product must have a unique, non-empty id")
        seen.add(product_id)

        history = product.get("priceHistory")
        page = index // history_page_size
        row = {key: value for key, value in product.items() if key in PRODUCT_FIELDS}
        if row.get("brand"):
            row["brand"] = normalise_brand(row["brand"])
        row["priceHistoryPage"] = page if isinstance(history, list) and history else None
        summary_products.append(row)

        if isinstance(history, list) and history:
            history_pages.setdefault(page, {})[product_id] = [
                {"date": entry.get("date"), "price": entry.get("price")}
                for entry in history
                if isinstance(entry, dict)
                and entry.get("date") is not None
                and isinstance(entry.get("price"), (int, float))
                and math.isfinite(float(entry["price"]))
            ]

    summary = {key: data[key] for key in SUMMARY_FIELDS if key in data}
    summary["brandDirectory"] = sorted({normalise_brand(name) for name in data.get("brandDirectory", []) if name} | {row["brand"] for row in summary_products if row.get("brand")}, key=str.casefold)
    summary["products"] = summary_products
    return summary, history_pages


def write_catalogue(root, data, history_page_size=HISTORY_PAGE_SIZE):
    root = Path(root)
    summary, history_pages = build_catalogue(data, history_page_size)
    destination = root / "data"
    destination.mkdir(parents=True, exist_ok=True)
    (destination / "price-finder-lite.js").write_text(
        compact_js_global("PRINTPROFIT_PRICE_DATA", summary), encoding="utf-8"
    )

    history_dir = destination / "price-history"
    history_dir.mkdir(parents=True, exist_ok=True)
    expected = set()
    for page, entries in history_pages.items():
        name = "page-" + str(page).zfill(3) + ".json"
        expected.add(name)
        (history_dir / name).write_text(compact_json(entries), encoding="utf-8")
    for old_file in history_dir.glob("page-*.json"):
        if old_file.name not in expected:
            old_file.unlink()

    lite_bytes = (destination / "price-finder-lite.js").stat().st_size
    history_bytes = sum((history_dir / name).stat().st_size for name in expected)
    return len(summary["products"]), len(history_pages), lite_bytes, history_bytes


def self_test():
    sample = {
        "currency": "GBP",
        "updatedAt": "2026-10-12",
        "sources": [],
        "brandDirectory": [],
        "products": [
            {
                "id": "product-" + str(i),
                "name": "Product " + str(i),
                "price": float(21 - i),
                "type": "PLA",
                "colourHex": "#123456",
                "sourceId": "source-" + str(i),
                "description": "remove this detail",
                "options": ["unused"],
                "priceHistory": [{"date": "2026-10-12", "price": 21 - i}],
            }
            for i in range(21)
        ],
    }
    summary, pages = build_catalogue(sample, history_page_size=20)
    assert len(summary["products"]) == 21
    assert summary["products"][0]["id"] == "product-20"
    assert "priceHistory" not in summary["products"][0]
    assert "description" not in summary["products"][0]
    assert "sourceId" not in summary["products"][0]
    assert summary["products"][0]["type"] == "PLA"
    assert summary["products"][0]["colourHex"] == "#123456"
    assert summary["products"][0]["priceHistoryPage"] == 0
    assert summary["products"][20]["priceHistoryPage"] == 1
    assert len(pages) == 2 and len(pages[0]) == 20 and len(pages[1]) == 1
    assert json_safe({"value": math.nan}) == {"value": None}
    with TemporaryDirectory() as temp:
        root = Path(temp)
        stale = root / "data" / "price-history" / "page-999.json"
        stale.parent.mkdir(parents=True)
        stale.write_text("{}", encoding="utf-8")
        count, page_count, listing_bytes, history_bytes = write_catalogue(root, sample, 20)
        assert count == 21 and page_count == 2
        assert listing_bytes > 0 and history_bytes > 0
        assert not stale.exists()
        compact = (root / "data" / "price-finder-lite.js").read_text(encoding="utf-8")
        assert '"priceHistory"' not in compact and '"description"' not in compact
        assert '"sourceId"' not in compact
        assert '"colourHex"' in compact and '"type":"PLA"' in compact
        saved_page = json.loads((root / "data" / "price-history" / "page-000.json").read_text(encoding="utf-8"))
        assert len(saved_page) == 20
    print("Catalogue builder checks passed.")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", type=Path, default=ROOT, help="PrintProfit repository checkout")
    parser.add_argument("--self-test", action="store_true", help="Run checks using a small synthetic catalogue")
    args = parser.parse_args()
    if args.self_test:
        self_test()
        return
    root = args.root.resolve()
    source = root / "data" / "price-finder.json"
    data = json.loads(source.read_text(encoding="utf-8"))
    count, pages, lite_bytes, history_bytes = write_catalogue(root, data)
    print(
        "Built compact comparison data for "
        + str(count)
        + " products in "
        + str(pages)
        + " on-demand history pages; listing payload "
        + str(lite_bytes)
        + " bytes, history pages "
        + str(history_bytes)
        + " bytes."
    )


if __name__ == "__main__":
    main()
