import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const data = await request.json();

	const { name, email, subject, message, category } = data;

	if (!name || !email || !subject || !message) {
		return json({ error: 'All fields are required.' }, { status: 400 });
	}

	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
		return json({ error: 'Please provide a valid email address.' }, { status: 400 });
	}

	try {
		// Forward to support email via a simple fetch to an external service
		// For now, we'll log and return success — replace with actual email sending
		console.log('Contact form submission:', { name, email, subject, message, category });

		return json({ success: 'Message sent successfully! We\'ll get back to you soon.' });
	} catch {
		return json({ error: 'Something went wrong. Please try again or email us directly.' }, { status: 500 });
	}
};
