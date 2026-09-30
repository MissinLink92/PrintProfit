#!/usr/bin/env python3
import json
import re
import sys
import time
import urllib.request
from datetime import datetime, timezone
from html import unescape
from pathlib import Path
from urllib.parse import parse_qs, quote_plus, unquote, urljoin, urlparse

ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = ROOT / "data" / "price-finder.json"

USER_AGENT = "PrintProfit-PriceFinder/1.1 (+https://github.com/MissinLink92/PrintProfit)"
TIMEOUT = 20
SEARCH_TIMEOUT = 15
IMAGE_SEARCH_LIMIT = 3
SEARCH_DELAY = 0.35
BAD_IMAGE_WORDS = ("logo", "favicon", "sprite", "placeholder", "avatar", "icon", "badge", "payment")

def fetch(url: str, timeout: int = TIMEOUT) -> str:
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": USER_AGENT,
            "Accept": "text/html,application/xhtml+xml,image/avif,image/webp,*/*;q=0.8",
        },
    )
    with urllib.request.urlopen(req, timeout=timeout) as r:
        charset = r.headers.get_content_charset() or "utf-8"
        return r.read().decode(charset, errors="replace")

def normalise_name(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", " ", (value or "").lower()).strip()

def meaningful_tokens(value: str):
    stop = {
        "the", "and", "for", "with", "from", "filament", "printer", "3d", "kg", "mm",
        "uk", "store", "official", "black", "white", "grey", "gray"
    }
    return [t for t in normalise_name(value).split() if len(t) > 2 and t not in stop][:8]

def walk_json(value):
    if isinstance(value, dict):
        yield value
        for v in value.values():
            yield from walk_json(v)
    elif isinstance(value, list):
        for v in value:
            yield from walk_json(v)

def ld_products(html: str):
    blocks = re.findall(
        r'<script[^>]+type=["\']application/ld\+json["\'][^>]*>(.*?)</script>',
        html,
        flags=re.I | re.S,
    )
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
        image = image.get("url") or image.get("contentUrl")
    if isinstance(image, str) and image.strip():
        return safe_image_url(urljoin(page_url, image.strip()))
    return None

def meta_image(html: str, page_url: str):
    patterns = [
        r'<meta[^>]+(?:property|name)=["\']og:image["\'][^>]+content=["\']([^"\']+)["\']',
        r'<meta[^>]+content=["\']([^"\']+)["\'][^>]+(?:property|name)=["\']og:image["\']',
        r'<meta[^>]+(?:property|name)=["\']twitter:image(?::src)?["\'][^>]+content=["\']([^"\']+)["\']',
        r'<meta[^>]+content=["\']([^"\']+)["\'][^>]+(?:property|name)=["\']twitter:image(?::src)?["\']',
        r'<link[^>]+rel=["\']image_src["\'][^>]+href=["\']([^"\']+)["\']',
    ]
    for pattern in patterns:
        m = re.search(pattern, html, flags=re.I | re.S)
        if m:
            candidate = safe_image_url(urljoin(page_url, unescape(m.group(1)).strip()))
            if candidate:
                return candidate
    return None

def safe_image_url(url: str):
    if not url or not re.match(r"^https?://", url, flags=re.I):
        return None
    lowered = url.lower()
    if any(word in lowered for word in BAD_IMAGE_WORDS):
        return None
    return url

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

def extract_page_image(html: str, page_url: str, target_name: str = ""):
    match = find_match(list(ld_products(html)), target_name)
    if match:
        image = product_image(match, page_url)
        if image:
            return image, "json-ld"
    image = meta_image(html, page_url)
    return (image, "og-image") if image else (None, None)

def unwrap_search_url(href: str):
    href = unescape(href)
    if href.startswith("//duckduckgo.com/l/?"):
        query = parse_qs(urlparse("https:" + href).query)
        target = query.get("uddg", [None])[0]
        return unquote(target) if target else None
    if href.startswith("http://") or href.startswith("https://"):
        return href
    return None

def ddg_search(query: str):
    url = "https://html.duckduckgo.com/html/?q=" + quote_plus(query)
    req = urllib.request.Request(
        url,
        headers={"User-Agent": USER_AGENT, "Accept": "text/html,application/xhtml+xml"},
    )
    with urllib.request.urlopen(req, timeout=SEARCH_TIMEOUT) as r:
        html = r.read().decode(r.headers.get_content_charset() or "utf-8", errors="replace")
    links = []
    for href in re.findall(
        r'<a[^>]+class=["\'][^"\']*result__a[^"\']*["\'][^>]+href=["\']([^"\']+)["\']',
        html,
        flags=re.I | re.S,
    ):
        resolved = unwrap_search_url(href)
        if resolved and resolved not in links:
            links.append(resolved)
        if len(links) >= IMAGE_SEARCH_LIMIT:
            break
    return links

def product_page_is_relevant(html: str, target_name: str, url: str):
    tokens = meaningful_tokens(target_name)
    haystack = normalise_name(html[:900000] + " " + url)
    if not tokens:
        return True
    hits = sum(1 for token in tokens if token in haystack)
    return hits >= max(2, min(3, len(tokens)))

def search_image_for_item(item):
    name = item.get("name", "")
    retailer = item.get("retailer", "")
    configured = item.get("url", "")
    host = urlparse(configured).netloc.replace("www.", "")
    query = f'"{name}" {retailer}'.strip()
    if host:
        query += f" site:{host}"
    try:
        links = ddg_search(query)
    except Exception:
        return None, None, None, "search-error"

    for link in links:
        time.sleep(SEARCH_DELAY)
        try:
            html = fetch(link, timeout=SEARCH_TIMEOUT)
            if not product_page_is_relevant(html, name, link):
                continue
            image, method = extract_page_image(html, link, name)
            if image:
                return image, link, method, "found"
        except Exception:
            continue
    return None, None, None, "not-found"

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
    image_changes = 0
    image_found = 0
    image_searches = 0
    warnings = []

    data.setdefault("refreshPolicy", {})
    data["refreshPolicy"]["frequency"] = "every 12 hours"
    data["refreshPolicy"]["timezone"] = "Europe/London"
    data["refreshPolicy"]["note"] = "Prices and product images are reference snapshots. Check the retailer before purchase."

    for item in data.get("products", []):
        url = item.get("url")
        if not url:
            continue

        price_refresh = bool(item.get("autoRefresh"))
        needs_image = item.get("imageAutoRefresh", True) and not item.get("image")
        if not (price_refresh or needs_image):
            continue

        try:
            html = fetch(url)
            products = list(ld_products(html))
            match = find_match(products, item.get("name", ""))

            image = product_image(match, url) if match else None
            image_method = "json-ld" if image else None
            # Only trust page-level og:image when the page matched the requested product.
            # Category/collection pages often expose a generic banner, which must not
            # become the product thumbnail.
            if not image and match:
                image = meta_image(html, url)
                image_method = "og-image" if image else None

            if image:
                old_image = item.get("image")
                item["image"] = image
                item["imageStatus"] = "available"
                item["imageMethod"] = image_method
                item["imageSourceUrl"] = url
                item["imageChecked"] = date_str
                if old_image != image:
                    image_changes += 1
                image_found += 1
            elif needs_image:
                image_searches += 1
                found, source_url, method, search_status = search_image_for_item(item)
                item["imageSearchStatus"] = search_status
                item["imageSearchQuery"] = f'{item.get("name","")} {item.get("retailer","")}'.strip()
                item["imageChecked"] = date_str
                if found:
                    item["image"] = found
                    item["imageStatus"] = "available"
                    item["imageMethod"] = "web-search-" + str(method)
                    item["imageSourceUrl"] = source_url
                    image_found += 1
                    image_changes += 1
                else:
                    item["imageStatus"] = "fallback"

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
            item["imageStatus"] = "available" if item.get("image") else item.get("imageStatus", "fallback")

        except Exception as exc:
            item["lastCheckStatus"] = "error"
            item["imageSearchStatus"] = "fetch-error"
            warnings.append(f"Fetch failed: {item.get('name')} — {exc}")

    data["updatedAt"] = date_str
    data["lastRefreshSummary"] = {
        "checkedAt": now.isoformat(),
        "changedProducts": changes,
        "changedImages": image_changes,
        "imagesFound": image_found,
        "imageSearches": image_searches,
        "warnings": len(warnings)
    }
    DATA_PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    browser_data_path = ROOT / "data" / "price-finder.js"
    browser_data = "(()=>{\n'use strict';\n// Generated from data/price-finder.json by the PrintProfit Price Finder updater.\nwindow.PRINTPROFIT_PRICE_DATA="
    browser_data += json.dumps(data, indent=2, ensure_ascii=False)
    browser_data += ";\n})();\n"
    browser_data_path.write_text(browser_data, encoding="utf-8")

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
    print(
        f"Price Finder refresh complete: {changes} price changes, "
        f"{image_changes} image changes, {image_found} images found."
    )

if __name__ == "__main__":
    try:
        update()
    except Exception as exc:
        print(f"Fatal updater error: {exc}", file=sys.stderr)
        sys.exit(1)
