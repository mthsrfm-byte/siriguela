// Workers Static Assets can return a full MP4 for a single-range request.
export default {
  async fetch(request, env) {
    const response = await env.LOJA.fetch(request);
    const range = request.headers.get("Range");
    if (response.status !== 200 || request.method !== "GET" || !range ||
        !new URL(request.url).pathname.endsWith(".mp4")) return response;
    const match = /^bytes=(\d*)-(\d*)$/i.exec(range);
    if (!match || (!match[1] && !match[2])) return response;
    const validator = request.headers.get("If-Range");
    if (validator && validator !== response.headers.get("ETag") &&
        validator !== response.headers.get("Last-Modified")) return response;

    const bytes = await response.arrayBuffer();
    const size = bytes.byteLength;
    const start = match[1] ? Number(match[1]) : Math.max(0, size - Number(match[2]));
    const end = match[1] && match[2] ? Math.min(Number(match[2]), size - 1) : size - 1;
    const headers = new Headers(response.headers);
    headers.set("Accept-Ranges", "bytes");
    headers.delete("Content-Encoding");
    if (start > end || start >= size) {
      headers.set("Content-Range", "bytes */" + size);
      headers.set("Content-Length", "0");
      return new Response(null, { status: 416, headers });
    }
    headers.set("Content-Range", `bytes ${start}-${end}/${size}`);
    headers.set("Content-Length", String(end - start + 1));
    return new Response(bytes.slice(start, end + 1), { status: 206, headers });
  }
};
