"""Bounded public-source reader. Does not log in or bypass site restrictions."""
import hashlib
import ipaddress
import socket
import time
import urllib.error
import urllib.request
import urllib.robotparser
from urllib.parse import urlparse, urljoin
from urllib.parse import quote, urlsplit, urlunsplit
from email.utils import parsedate_to_datetime
from datetime import datetime, timezone

UA = 'PrintProfit-Nightly/1.0 (+https://github.com/MissinLink92/PrintProfit)'

def public_url(url):
    parsed = urlparse(url)
    if parsed.scheme not in ('https', 'http') or not parsed.hostname or parsed.username or parsed.password:
        raise ValueError('Only public HTTP(S) source URLs are accepted')
    if parsed.port not in (None, 80, 443):
        raise ValueError('Unexpected source port')
    for address in socket.getaddrinfo(parsed.hostname, parsed.port or 443, type=socket.SOCK_STREAM):
        if not ipaddress.ip_address(address[4][0]).is_global:
            raise ValueError('Source resolves to a non-public address')
    return url

class PublicRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return super().redirect_request(req, fp, code, msg, headers, public_url(newurl))

class Reader:
    def __init__(self, deadline_seconds=2400):
        self.opener = urllib.request.build_opener(PublicRedirect())
        self.cache, self.robots, self.last = {}, {}, {}
        self.rate_limited = set()
        self.deadline = time.monotonic() + deadline_seconds
        self.count = 0

    def _read(self, url, limit):
        public_url(url)
        host = urlparse(url).netloc
        origin = urlparse(url).scheme + '://' + host
        robots = self.robots.get(origin)
        delay = max(1.2, (robots.crawl_delay(UA) or 0) if robots else 0)
        parts = urlsplit(url)
        encoded = urlunsplit((parts.scheme, parts.netloc, quote(parts.path, safe='/%:@!$&\'()*+,;=-._~'),
                              quote(parts.query, safe='/%?:@!$&\'()*+,;=-._~'), ''))
        request = urllib.request.Request(encoded, headers={'User-Agent': UA, 'Accept': '*/*'})
        for attempt in range(3):
            wait = max(0, delay - (time.monotonic() - self.last.get(host, 0)))
            if time.monotonic() + wait >= self.deadline:
                raise TimeoutError('Nightly time budget reached; remaining values retained')
            time.sleep(wait)
            self.last[host] = time.monotonic()
            try:
                with self.opener.open(request, timeout=18) as response:
                    body = response.read(limit + 1)
                    if len(body) > limit:
                        raise ValueError('Source exceeds the download size limit')
                    return body, response.headers.get_content_charset() or 'utf-8', response.geturl()
            except urllib.error.HTTPError as exc:
                if exc.code not in (429, 503) or attempt == 2:
                    if exc.code == 429:
                        self.rate_limited.add(host)
                    raise
                retry = exc.headers.get('Retry-After', '')
                try:
                    pause = float(retry)
                except ValueError:
                    try:
                        pause = (parsedate_to_datetime(retry)-datetime.now(timezone.utc)).total_seconds()
                    except (ValueError, TypeError):
                        pause = 5 * (attempt + 1)
                pause = max(delay, pause)
                if pause > 60 or time.monotonic() + pause >= self.deadline:
                    if exc.code == 429:
                        self.rate_limited.add(host)
                    raise
                time.sleep(pause)

    def allowed(self, url):
        parsed = urlparse(url)
        origin = parsed.scheme + '://' + parsed.netloc
        if origin not in self.robots:
            robots = urllib.robotparser.RobotFileParser()
            try:
                raw, encoding, _ = self._read(origin + '/robots.txt', 500000)
                robots.parse(raw.decode(encoding, errors='replace').splitlines())
            except urllib.error.HTTPError as exc:
                if exc.code == 404:
                    robots.parse([])
                else:
                    error = ValueError('Cannot read robots.txt: HTTP ' + str(exc.code))
                    self.robots[origin] = error
                    raise error from exc
            self.robots[origin] = robots
        if isinstance(self.robots[origin], Exception):
            raise self.robots[origin]
        if not self.robots[origin].can_fetch(UA, url):
            raise ValueError('Source robots.txt disallows this URL')

    def get(self, url, limit=12000000):
        if time.monotonic() > self.deadline:
            raise TimeoutError('Nightly time budget reached; remaining values retained')
        if url in self.cache:
            value = self.cache[url]
            if isinstance(value, Exception):
                raise value
            return value
        if urlparse(url).netloc in self.rate_limited:
            raise ValueError('Retailer rate limited this run; remaining values retained until the next update')
        try:
            self.allowed(url)
            value = self._read(url, limit)
            self.count += 1
            self.cache[url] = value
            return value
        except Exception as exc:
            self.cache[url] = exc
            raise

    def text(self, url):
        body, encoding, final_url = self.get(url)
        return body.decode(encoding, errors='replace'), final_url

    def json(self, url):
        import json
        return json.loads(self.text(url)[0])
