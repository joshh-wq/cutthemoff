import type { APIRoute } from 'astro';
import { findByToken, verifyToken } from '../../lib/db';
import { BUTTONDOWN_API_KEY } from 'astro:env/server';

export const prerender = false;

export const GET: APIRoute = async ({ url, redirect }) => {
  const token = url.searchParams.get('token');

  if (!token) {
    return redirect('/confirm?status=error');
  }

  const row = await findByToken(token);

  if (!row) {
    return redirect('/confirm?status=error');
  }

  if (row.verified) {
    return redirect('/confirm?status=already');
  }

  await verifyToken(token);

  // Add to Buttondown if they opted in
  if (row.subscribed && BUTTONDOWN_API_KEY) {
    try {
      await fetch('https://api.buttondown.com/v1/subscribers', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${BUTTONDOWN_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: row.email }),
      });
    } catch (err) {
      console.error('Buttondown error:', err);
    }
  }

  return redirect('/confirm?status=success');
};
