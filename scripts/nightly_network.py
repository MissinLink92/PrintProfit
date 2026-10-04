"""Bounded public-source reader. Does not log in or bypass site restrictions."""
import hashlib
import ipaddress
import socket
import time
import urllib.error
import urllib.request
import urllib.robotparser
from urllib.parse import urlparse, urljoin

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
        self.deadline = time.monotonic() + deadline_seconds
        self.count = 0

    def _read(self, url, limit):
        public_url(url)
        host = urlparse(url).netloc
        time.sleep(max(0, 0.6 - (time.monotonic() - self.last.get(host, 0))))
        self.last[host] = time.monotonic()
        request = urllib.request.Request(url, headers={'User-Agent': UA, 'Accept': '*/*'})
        with self.opener.open(request, timeout=18) as response:
            body = response.read(limit + 1)
            if len(body) > limit:
                raise ValueError('Source exceeds the download size limit')
            return body, response.headers.get_content_charset() or 'utf-8', response.geturl()

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
                    raise ValueError('Cannot read robots.txt: HTTP ' + str(exc.code)) from exc
            self.robots[origin] = robots
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
