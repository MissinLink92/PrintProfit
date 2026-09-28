#!/usr/bin/env python3
import json
import re
import sys
import urllib.request
from datetime import datetime, timezone
from html import unescape
from pathlib import Path
from urllib.parse import urljoin

ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = ROOT / "data" / "price-finder.json"

USER_AGENT = "PrintProfit-PriceFinder/1.0 (+https://github.com/MissinLink92/PrintProfit)"
TIMEOUT = 20

def fetch(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT, "Accept": "text/html,application/xhtml+xml"})
    with urllib.request.urlopen(req, timeout=TIMEOUT) as r:
        charset = r.headers.get_content_charset() or "utf-8"
        return r.read().decode(charset, errors="replace")

def normalise_name(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", " ", (value or "").lower()).strip()

def walk_json(value):
    if isinstance(value, dict):
        yield value
        for v in value.values():
            yield from walk_json(v)
    elif isinstance(value, list):
        for v in value:
            yield from walk_json(v)

def ld_products(html: str):
    blocks = re.findall(r'<script[^>]+type=["\']application/ld\+json["\'][^>]*>(.*?)</script>', html, flags=re.I | re.S)
    for block in blocks:
        raw = unescape(block).strip()
        try:
            data = json.loads(raw)
        except Exception:
            continue
        for obj in walk_json(data):
            typ = obj.get("@type") if isinstance(obj, dict) else None
            types = typ if isinstance(typ, list) else [typ]
            if any(str(t).lower() == "product" for t in types):
                yield obj

def product_image(product, page_url: str = ""):
    if not isinstance(product, dict):
        return None
    image = product.get("image")
    if isinstance(image, list):
        image = image[0] if image else None
    if isinstance(image, dict):
        image = image.get("url")
    if isinstance(image, str) and image.strip():
        return urljoin(page_url, image.strip())
    return None

def parse_price(value):
    try:
        price = float(str(value).replace(",", "").strip())
        return price if price > 0 else None
    except Exception:
        return None

def product_price(product):
    offers = product.get("offers")
    offer_list = offers if isinstance(offers, list) else [offers]
    prices = []
    for offer in offer_list:
        if not isinstance(offer, dict):
            continue
        for key in ("price", "lowPrice"):
            p = parse_price(offer.get(key))
            if p:
                prices.append(p)
    return min(prices) if prices else None

def find_match(products, target_name):
    target = normalise_name(target_name)
    exact = []
    fuzzy = []
    for p in products:
        name = normalise_name(p.get("name", ""))
        if not name:
            continue
        if name == target:
            exact.append(p)
        elif target in name or name in target:
            fuzzy.append(p)
    return (exact or fuzzy or [None])[0]

def append_price_history(item, previous_price, previous_date, new_price, date_str, max_points=90):
    history = item.get("priceHistory")
    if not isinstance(history, list):
        history = []
    cleaned = []
    for point in history:
        if not isinstance(point, dict):
            continue
        price = parse_price(point.get("price"))
        date = str(point.get("date", "")).strip()
        if price is not None and date:
            cleaned.append({"date": date, "price": round(price, 2)})
    if previous_price is not None:
        previous_date = str(previous_date or date_str)
        if not cleaned or cleaned[-1]["date"] != previous_date or abs(cleaned[-1]["price"] - previous_price) >= 0.005:
            cleaned.append({"date": previous_date, "price": round(previous_price, 2)})
    if not cleaned or cleaned[-1]["date"] != date_str or abs(cleaned[-1]["price"] - new_price) >= 0.005:
        cleaned.append({"date": date_str, "price": round(new_price, 2)})
    item["priceHistory"] = cleaned[-max_points:]

def update():
    data = json.loads(DATA_PATH.read_text(encoding="utf-8"))
    now = datetime.now(timezone.utc).astimezone()
    date_str = now.date().isoformat()
    changes = 0
    warnings = []

    for item in data.get("products", []):
        url = item.get("url")
        if not url:
            continue
        price_refresh = bool(item.get("autoRefresh"))
        image_refresh = item.get("imageAutoRefresh", True) and not item.get("image")
        if not (price_refresh or image_refresh):
            continue
        try:
            html = fetch(url)
            products = list(ld_products(html))
            match = find_match(products, item.get("name", ""))
            image = product_image(match, url) if match else None
            if image:
                item["image"] = image
                item["imageStatus"] = "available"
                item["imageChecked"] = date_str
            elif image_refresh:
                item["imageStatus"] = "fallback"
                item["imageChecked"] = date_str
            if not price_refresh:
                continue
            price = product_price(match) if match else None
            if price is None:
                warnings.append(f"No safe product price found: {item.get('name')} ({url})")
                if image:
                    item["lastCheckStatus"] = "image-ok-price-missing"
                continue
            old = parse_price(item.get("price"))
            previous_date = item.get("updated") or date_str
            if old and (price < old * 0.5 or price > old * 2.0):
                warnings.append(f"Large price change skipped: {item.get('name')} {old:.2f} -> {price:.2f}")
                item["lastCheckStatus"] = "price-change-review"
                continue
            if old is None or abs(old - price) >= 0.005:
                item["price"] = round(price, 2)
                if item.get("weightGrams"):
                    item["unit"] = round(price * 1000 / float(item["weightGrams"]), 2)
                changes += 1
            append_price_history(item, old if old is not None else price, previous_date, price, date_str)
            item["updated"] = date_str
            item["lastCheckStatus"] = "ok"
            item["imageStatus"] = "available" if item.get("image") else "fallback"
        except Exception as exc:
            item["lastCheckStatus"] = "error"
            warnings.append(f"Fetch failed: {item.get('name')} — {exc}")

    data["updatedAt"] = date_str
    data["lastRefreshSummary"] = {
        "checkedAt": now.isoformat(),
        "changedProducts": changes,
        "warnings": len(warnings)
    }
    DATA_PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    # Generate a static browser bundle so Compare Products does not depend on runtime JSON fetches.
    browser_data_path = ROOT / "data" / "price-finder.js"
    browser_data = "(()=>{\n'use strict';\n// Generated from data/price-finder.json by the PrintProfit Price Finder updater.\nwindow.PRINTPROFIT_PRICE_DATA="
    browser_data += json.dumps(data, indent=2, ensure_ascii=False)
    browser_data += ";\n})();\n"
    browser_data_path.write_text(browser_data, encoding="utf-8")

    # Keep the calculator's printer reference prices aligned with Price Finder.
    printers = {}
    for item in data.get("products", []):
        if item.get("category") == "printer" and parse_price(item.get("price")):
            name = item["name"]
            for prefix in ("Bambu Lab ", "ELEGOO ", "Creality ", "Flashforge "):
                if name.startswith(prefix):
                    name = name[len(prefix):]
                    break
            printers[name] = round(float(item["price"]), 2)
    printer_path = ROOT / "printer-price-data.js"
    lines = [
        "(()=>{",
        "'use strict';",
        "// Generated from data/price-finder.json by the Price Finder updater.",
        "window.PRINTPROFIT_PRINTER_PRICES=Object.freeze({"
    ]
    for name, price in sorted(printers.items()):
        lines.append(f"  {json.dumps(name)}:{price:.2f},")
    lines.extend(["});", "})();", ""])
    printer_path.write_text("\n".join(lines), encoding="utf-8")

    if warnings:
        print("\n".join(warnings))
    print(f"Price Finder refresh complete: {changes} price changes.")

if __name__ == "__main__":
    try:
        update()
    except Exception as exc:
        print(f"Fatal updater error: {exc}", file=sys.stderr)
        sys.exit(1)
