import type { APIRoute } from 'astro';
import { ads, adsEnabled } from '../legal';

// Authorised Digital Sellers file required by AdSense.
export const GET: APIRoute = () => {
  const body = adsEnabled()
    ? `google.com, ${ads.adsenseClient.replace('ca-', '')}, DIRECT, f08c47fec0942fa0\n`
    : '# AdSense todavía no está configurado (ver src/legal.ts)\n';
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
