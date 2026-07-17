/**
 * Cloudflare Worker Alternative for Intervals.icu Proxy
 * Deploy with Wrangler: wrangler deploy
 *
 * Usage: your-worker.workers.dev/?endpoint=/athlete/i123/activities&athleteId=i123
 * Env: INTERVALS_API_KEY
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const endpoint = url.searchParams.get('endpoint');
    const apiKey = env.INTERVALS_API_KEY || request.headers.get('x-api-key');

    if (!endpoint) return new Response(JSON.stringify({ error: 'Missing ?endpoint=' }), { status: 400 });

    const target = `https://intervals.icu/api/v1${endpoint}`;
    const resp = await fetch(target, {
      method: request.method,
      headers: {
        'Authorization': 'Basic ' + btoa(`API_KEY:${apiKey}`),
        'Content-Type': 'application/json'
      },
      body: request.method !== 'GET' ? await request.text() : undefined
    });

    const data = await resp.text();
    return new Response(data, {
      status: resp.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}
