self.addEventListener('install', event => {
    event.waitUntil(
      caches.open('v1').then(cache => {
        return cache.addAll([]);
      })
    );
  });
  
  self.addEventListener('fetch', event => {
    event.respondWith(
      fetch(event.request).then(response => {
        // Clone the response to modify headers
        let responseClone = response.clone();
        let modifiedHeaders = new Headers(responseClone.headers);
  
        // Add CSP-Report-Only header
        modifiedHeaders.append(
          'Content-Security-Policy-Report-Only',
          "default-src 'none'; form-action 'none'; frame-ancestors 'none'; report-to default; report-uri https://fisun.report-uri.com/r/d/csp/wizard"
        );
  
        // Add Report-To header
        modifiedHeaders.append(
          'Report-To',
          '{"group":"default","max_age":31536000,"endpoints":[{"url":"https://fisun.report-uri.com/a/d/g"}],"include_subdomains":true}'
        );
  
        // Create a new response with the modified headers
        return new Response(responseClone.body, {
          status: responseClone.status,
          statusText: responseClone.statusText,
          headers: modifiedHeaders
        });
      })
    );
  });  