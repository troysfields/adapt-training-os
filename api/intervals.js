// Vercel Serverless Proxy for Intervals.icu API
// Solves CORS + keeps API key off client in production
// Deploy to Vercel with env: INTERVALS_API_KEY
// Or call directly from client if self-hosting (client-side fallback in app)

export default async function handler(req, res) {
  // CORS for your domain
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { endpoint, athleteId } = req.query;
  const apiKey = process.env.INTERVALS_API_KEY || req.headers['x-api-key'];

  if (!apiKey) {
    return res.status(400).json({ error: 'Missing INTERVALS_API_KEY. Set env var or pass x-api-key header.' });
  }
  if (!endpoint) {
    return res.status(400).json({ error: 'Missing ?endpoint= e.g., /athlete/{id}/activities or /athlete/{id}/wellness' });
  }

  const url = `https://intervals.icu/api/v1${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  try {
    const response = await fetch(url, {
      method: req.method,
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`API_KEY:${apiKey}`).toString('base64'),
        'Content-Type': 'application/json'
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
    });

    const text = await response.text();
    let data;
    try { data = JSON.parse(text); } catch { data = text; }

    res.status(response.status).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
