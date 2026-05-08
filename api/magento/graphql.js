import { sanitizeAuthorizationHeader, setPreflight, forwardFetch } from '../_helpers.js';

const FORWARDED_HEADERS = ['store', 'currency'];

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return setPreflight(res, 'POST');

  const backendUrl = process.env.VITE_BACKEND_GRAPHQL_URL;
  if (!backendUrl) return res.status(500).json({ error: 'VITE_BACKEND_GRAPHQL_URL not configured' });

  const headers = { 'Content-Type': 'application/json' };
  const auth = sanitizeAuthorizationHeader(req.headers.authorization);
  if (auth) headers['Authorization'] = auth;
  for (const key of FORWARDED_HEADERS) {
    if (req.headers[key]) headers[key] = req.headers[key];
  }

  return forwardFetch(backendUrl, { method: 'POST', headers, body: JSON.stringify(req.body) }, res);
}
