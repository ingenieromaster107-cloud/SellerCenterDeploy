import https from 'https';

import { ENV } from 'src/environments';

/**
 * API Route que actúa como proxy GraphQL hacia el backend Magento.
 * Necesario porque el certificado TLS del servidor no incluye el hostname
 * en sus altnames, y el rewrite de Next.js no puede ignorar esa validación.
 */
export async function POST(request: Request) {
  const body = await request.text();
  const backendUrl = ENV.urlBackend as string;
  const parsed = new URL(backendUrl);

  const auth = request.headers.get('Authorization');
  const store = request.headers.get('Store');

  const reqHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    Host: parsed.host,
  };
  if (auth) reqHeaders.Authorization = auth;
  if (store) reqHeaders.Store = store;

  const data = await new Promise<string>((resolve, reject) => {
    const req = https.request(
      {
        hostname: parsed.hostname,
        port: parsed.port || 443,
        path: parsed.pathname,
        method: 'POST',
        headers: reqHeaders,
        rejectUnauthorized: false,
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on('data', (chunk: Buffer) => chunks.push(chunk));
        res.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
      }
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });

  return new Response(data, {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
