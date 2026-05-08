import type { IncomingMessage, ServerResponse } from 'http';

export const config = { api: { bodyParser: false } };

const FORWARDED_HEADERS = ['content-type', 'authorization', 'store', 'currency'];

export default async function handler(req: IncomingMessage & { url?: string }, res: ServerResponse) {
  const backendGraphqlUrl = process.env.VITE_BACKEND_GRAPHQL_URL;

  if (!backendGraphqlUrl) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'VITE_BACKEND_GRAPHQL_URL is not configured' }));
    return;
  }

  const backendOrigin = new URL(backendGraphqlUrl).origin;
  const strippedPath = (req.url ?? '').replace(/^\/api\/magento/, '');
  const targetUrl = `${backendOrigin}${strippedPath}`;

  const forwardHeaders: Record<string, string> = {};
  for (const key of FORWARDED_HEADERS) {
    const val = req.headers[key];
    if (val) forwardHeaders[key] = Array.isArray(val) ? val[0] : val;
  }

  const body = await new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });

  const upstream = await fetch(targetUrl, {
    method: req.method,
    headers: forwardHeaders,
    body: body.length > 0 ? body : undefined,
  });

  const responseBody = await upstream.text();

  res.writeHead(upstream.status, {
    'Content-Type': upstream.headers.get('content-type') ?? 'application/json',
    'Access-Control-Allow-Origin': '*',
  });
  res.end(responseBody);
}
