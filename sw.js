/* Installable online-first app. Never cache prices, offers or account data. */
'use strict';
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('fetch',event=>{
 if(event.request.mode!=='navigate'||event.request.method!=='GET')return;
 event.respondWith(fetch(event.request).catch(()=>new Response(`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>PrintProfit — Offline</title><body style="background:#071018;color:#f5f8fb;font:18px/1.6 system-ui;padding:30px;max-width:600px;margin:auto"><h1>You’re offline</h1><p>Reconnect to use PrintProfit and check current prices and offers. Saved browser projects have not been cleared.</p><button onclick="location.reload()" style="font:inherit;padding:12px 20px">Try again</button></body></html>`,{status:503,headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}})));
});
