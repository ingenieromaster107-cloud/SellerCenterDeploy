import { sanitizeAuthorizationHeader, setPreflight, forwardFetch, streamToBuffer } from '../../../../_helpers.js';

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return setPreflight(res, 'POST');

  const backendGraphqlUrl = process.env.VITE_BACKEND_GRAPHQL_URL;
  if (!backendGraphqlUrl) return res.status(500).json({ error: 'VITE_BACKEND_GRAPHQL_URL not configured' });

  const backendOrigin = new URL(backendGraphqlUrl).origin;
  const query = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
  const targetUrl = `${backendOrigin}/rest/V1/import/products${query}`;

  const bodyBuffer = await streamToBuffer(req);

  const headers = {};
  if (req.headers['content-type']) headers['Content-Type'] = req.headers['content-type'];
  headers['Content-Length'] = String(bodyBuffer.length);
  const auth = sanitizeAuthorizationHeader(req.headers.authorization);
  if (auth) headers['Authorization'] = auth;

  return forwardFetch(targetUrl, { method: 'POST', headers, body: bodyBuffer }, res);
}
