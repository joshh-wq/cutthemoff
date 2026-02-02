import type { APIRoute } from 'astro';
import { findByEmail, insertCancellation, updateToken } from '../../lib/db';
import { Resend } from 'resend';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { email, subscribe } = body;

    if (!email) {
      return new Response(JSON.stringify({ error: 'Email is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ error: 'Invalid email address.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const existing = await findByEmail(email.toLowerCase());

    if (existing?.verified) {
      return new Response(JSON.stringify({ error: 'This email has already been counted. Thank you!' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const token = crypto.randomUUID();
    const siteUrl = globalThis.process?.env?.['SITE_URL'] || import.meta.env.SITE_URL || 'https://defundbillionaires.org';

    if (existing) {
      await updateToken(email.toLowerCase(), token);
    } else {
      await insertCancellation(email.toLowerCase(), token, !!subscribe);
    }

    const resendKey = globalThis.process?.env?.['RESEND_API_KEY'] || import.meta.env.RESEND_API_KEY;
    if (!resendKey) {
      return new Response(JSON.stringify({ error: 'Email service not configured.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const resend = new Resend(resendKey);
    const confirmUrl = `${siteUrl}/api/confirm?token=${token}`;

    await resend.emails.send({
      from: 'Defund Billionaires <noreply@defundbillionaires.org>',
      to: email,
      subject: 'Confirm your Amazon cancellation',
      text: `Thanks for cancelling and joining this strike to defund Amazon.\n\nClick the link below to confirm your cancellation and be counted:\n\n${confirmUrl}\n\nEvery cancellation counts. This is how we build economic power.\n\nNow spread the word — create a shareable image and post it:\nhttps://defundbillionaires.org/share\n\n— defundbillionaires.org`,
    });

    return new Response(JSON.stringify({ message: 'Check your email to confirm your cancellation.' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Report error:', err);
    return new Response(JSON.stringify({ error: 'Something went wrong. Please try again.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
