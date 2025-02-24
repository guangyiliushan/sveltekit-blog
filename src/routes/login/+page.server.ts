import { hash, verify } from '@node-rs/argon2';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, '/lucia');
	}
	return {};
};

export const actions: Actions = {
	login: async (event) => {
		const formData = await event.request.formData();
		const loginType = formData.get('logintype') as 'phone' | 'email' | 'username';
		const credential = formData.get(loginType);
		const password = formData.get('password');

		if (loginType === 'phone' && !/^1[3456789]\d{9}$/.test(credential as string)) {
			return fail(400, { message: '无效的手机号码格式' });
		}
		if (loginType === 'email' && !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(credential as string)) {
			return fail(400, { message: '无效的邮箱格式' });
		}

		let whereCondition;
		switch (loginType) {
			case 'phone':
				whereCondition = eq(table.users.phone, credential as string);
				break;
			case 'email':
				whereCondition = eq(table.users.email, credential as string);
				break;
			default:
				if (!validateUsername(credential)) {
					return fail(400, { message: '无效的用户名格式' });
				}
				whereCondition = eq(table.users.username, credential as string);
		}

		const results = await db.select().from(table.users).where(whereCondition);

		const existingUser = results.at(0);
		if (!existingUser) {
			return fail(400, { message: 'Incorrect username or password' });
		}
		if (!password) {
			return fail(400, { message: 'Password is required' });
		}
		const validPassword = await verify(existingUser.password, password.toString(), {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});
		if (!validPassword) {
			return fail(400, { message: 'Incorrect username or password' });
		}

		const sessionToken = auth.generateSessionToken();
		const session = await auth.createSession(sessionToken, existingUser.id , event);
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

		return redirect(302, '/lucia');
	},
	register: async (event) => {
		const formData = await event.request.formData();
		const username = formData.get('username');
		const password = formData.get('password');

		if (!validateUsername(username)) {
			return fail(400, { message: 'Invalid username' });
		}
		if (!validatePassword(password)) {
			return fail(400, { message: 'Invalid password' });
		}

		// const userId = generateUserId();
		const passwordHash = await hash(password.toString(), {
			// recommended minimum parameters
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		try {
			const phone = formData.get('phone');
			const email = formData.get('email');
			
			if (phone) {
				const [existingPhone] = await db.select().from(table.users).where(eq(table.users.phone, phone.toString()));
				if (existingPhone) return fail(400, { message: '手机号已注册' });
			}
			if (email) {
				const [existingEmail] = await db.select().from(table.users).where(eq(table.users.email, email.toString()));
				if (existingEmail) return fail(400, { message: '邮箱已注册' });
			}
			if (!phone && !email) {
				return fail(400, { message: '必须填写手机号或邮箱' });
			}
			const [existingUsername] = await db.select().from(table.users).where(eq(table.users.username, username));
			if (existingUsername) {
				return fail(400, { message: '用户名已存在' });
			}
			await db.insert(table.users).values({
				username: username as string,
				password: passwordHash,
				phone: phone || null,
				email: email || null,
				nickname: username as string
			});

			const [{ id: userId }] = await db.select({ id: table.users.id }).from(table.users).where(eq(table.users.username, username)).limit(1);

			const sessionToken = auth.generateSessionToken();
			const session = await auth.createSession(sessionToken, userId , event);
			auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
		} catch (e) {
			console.error(e);
			return fail(500, { message: 'An error has occurred' });
		}
		return redirect(302, '/lucia');
	}
};

// function generateUserId() {
// 	// ID with 120 bits of entropy, or about the same as UUID v4.
// 	const bytes = crypto.getRandomValues(new Uint8Array(15));
// 	const id = encodeBase32LowerCase(bytes);
// 	return id;
// }

function validateUsername(username: unknown): username is string {
	return (
		typeof username === 'string' &&
		username.length >= 3 &&
		username.length <= 31 &&
		/^[a-z0-9_-]+$/.test(username)
	);
}

function validatePassword(password: unknown): password is string {
	return typeof password === 'string' && password.length >= 6 && password.length <= 255;
}
