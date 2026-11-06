const types = { webp: 'image/webp', pdf: 'application/pdf', mp4: 'video/mp4' };

function byteRange(value, size) {
  const match = /^bytes=(\d*)-(\d*)$/.exec(value);
  if (!match || (!match[1] && !match[2]) || size === 0) return null;
  const start = match[1] ? Number(match[1]) : Math.max(0, size - Number(match[2]));
  const end = match[1] && match[2] ? Math.min(Number(match[2]), size - 1) : size - 1;
  return Number.isSafeInteger(start) && Number.isSafeInteger(end) && start <= end
    ? { offset: start, length: end - start + 1 } : null;
}

function headersFor(object, type, filename) {
  const headers = new Headers({
    'Content-Type': type,
    'Content-Length': String(object.size),
    'Cache-Control': filename ? 'private, no-store' : 'public, max-age=86400',
    'Accept-Ranges': 'bytes',
    'Access-Control-Allow-Origin': '*',
    'X-Content-Type-Options': 'nosniff',
    ETag: object.httpEtag,
  });
  if (filename) {
    const safe = filename.replace(/[\x00-\x1f\x7f/\\]/g, '_').slice(0, 150).toWellFormed();
    headers.set('Content-Disposition', "attachment; filename*=UTF-8''" + encodeURIComponent(safe).replace(/['()*]/g, char => '%' + char.charCodeAt(0).toString(16)));
  }
  return headers;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const match = /^\/([a-f0-9]{22}\.(webp|pdf|mp4))$/.exec(url.pathname);
    if (!match) return new Response(null, { status: 404 });
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response(null, { status: 405, headers: { Allow: 'GET, HEAD' } });
    }

    const [, key, extension] = match;
    const download = url.searchParams.get('download');
    const rangeHeader = request.method === 'GET' && request.headers.get('Range');
    const cacheKey = new Request(url.origin + url.pathname);
    const cached = !download && request.method === 'GET' && !rangeHeader && await caches.default.match(cacheKey);
    if (cached) return cached;

    const needsMetadata = request.method === 'HEAD' || Boolean(rangeHeader);
    const head = needsMetadata ? await env.ARCHIVE.head(key) : undefined;
    if (head === null) return new Response(null, { status: 404 });
    if (request.method === 'HEAD') return new Response(null, { headers: headersFor(head, types[extension], download) });

    const ifRange = request.headers.get('If-Range');
    let range;
    if (rangeHeader && (!ifRange || ifRange === head.httpEtag)) {
      range = byteRange(rangeHeader, head.size);
      if (!range) return new Response(null, { status: 416, headers: { 'Content-Range': 'bytes */' + head.size } });
    }
    const object = await env.ARCHIVE.get(key, range ? { range } : undefined);
    if (!object) return new Response(null, { status: 404 });
    const headers = headersFor(object, types[extension], download);
    if (range) {
      headers.set('Content-Length', String(range.length));
      headers.set('Content-Range', 'bytes ' + range.offset + '-' + (range.offset + range.length - 1) + '/' + object.size);
      return new Response(object.body, { status: 206, headers });
    }
    const response = new Response(object.body, { headers });
    if (!download && extension !== 'mp4') ctx.waitUntil(caches.default.put(cacheKey, response.clone()));
    return response;
  },
};
