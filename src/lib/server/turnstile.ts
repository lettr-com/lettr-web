import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';

interface TurnstileVerifyResponse {
	success: boolean;
	'action'?: string;
	'error-codes'?: string[];
	'hostname'?: string;
	'challenge_ts'?: string;
	'cdata'?: string;
}

const turnstileVerifyUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export async function verifyTurnstileToken(token: string, remoteIp?: string | null) {
	const secretKey = env.TURNSTILE_SECRET_KEY?.trim() ?? '';

	if (!secretKey) {
		throw error(500, 'Missing TURNSTILE_SECRET_KEY environment variable');
	}

	return verifyWithSecret(secretKey, token, remoteIp);
}

async function verifyWithSecret(secretKey: string, token: string, remoteIp?: string | null) {
	const body = new URLSearchParams({
		secret: secretKey,
		response: token
	});

	if (remoteIp) {
		body.set('remoteip', remoteIp);
	}

	const response = await fetch(turnstileVerifyUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body
	});

	if (!response.ok) {
		throw error(502, 'Could not verify captcha challenge');
	}

	const parsed = (await response.json().catch(() => null)) as TurnstileVerifyResponse | null;

	if (!parsed || typeof parsed.success !== 'boolean') {
		throw error(502, 'Invalid captcha verification response');
	}

	return parsed;
}
