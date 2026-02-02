import type { APIRoute } from 'astro';
import { getVerifiedCount } from '../../lib/db';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const count = await getVerifiedCount();
    return new Response(JSON.stringify({ count }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=30',
      },
    });
  } catch (err) {
    console.error('Count error:', err);
    return new Response(JSON.stringify({ count: 0 }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
