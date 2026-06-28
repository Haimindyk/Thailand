const KV_KEY = 'trip_data';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/data') {
      if (request.method === 'GET') {
        const stored = await env.TRIP_DATA.get(KV_KEY);
        if (stored) {
          return new Response(stored, { headers: { 'Content-Type': 'application/json' } });
        }
        const seed = await env.ASSETS.fetch(new URL('/data.json', request.url));
        const seedText = await seed.text();
        await env.TRIP_DATA.put(KV_KEY, seedText);
        return new Response(seedText, { headers: { 'Content-Type': 'application/json' } });
      }
      if (request.method === 'POST') {
        const body = await request.text();
        JSON.parse(body); // reject invalid JSON before persisting
        await env.TRIP_DATA.put(KV_KEY, body);
        return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
      }
      return new Response('Method not allowed', { status: 405 });
    }

    return env.ASSETS.fetch(request);
  },
};
