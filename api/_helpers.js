export function sanitizeAuthorizationHeader(auth) {
  if (!auth || typeof auth !== 'string') return undefined;
  let v = auth.trim();
  if (/^"(.*)"$/.test(v)) v = v.replace(/^"(.*)"$/, '$1').trim();
  const m = v.match(/^Bearer\s+"(.+)"$/i);
  if (m) return `Bearer ${m[1].trim()}`;
  if (/^Bearer\s+/i.test(v)) return v.replace(/^Bearer\s+/i, 'Bearer ').trim();
  if (v.split('.').length === 3) return `Bearer ${v}`;
  return v;
}

export async function streamToBuffer(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (c) => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}

export function setPreflight(res, methods) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', `${methods}, OPTIONS`);
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return res.status(204).end();
}

export async function forwardFetch(url, init, res) {
  const resp = await fetch(url, init);
  const text = await resp.text();
  res.setHeader('Content-Type', resp.headers.get('content-type') || 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  return res.status(resp.status).send(text);
}
