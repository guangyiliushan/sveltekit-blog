import * as auth from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { users, verification_codes } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

function generateRandomString(length: number, chars: string) {
    return Array.from(
        { length }, 
        () => chars[Math.floor(Math.random() * chars.length)]
    ).join('');
}

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/login');
	}
	return { user: event.locals.user };
};

export const actions: Actions = {
	logout: async (event) => {
		if (!event.locals.session) {
			return fail(401);
		}
		await auth.invalidateSession(event.locals.session.id);
		auth.deleteSessionTokenCookie(event);

		return redirect(302, '/login');
	},

	resend: async ({ request, locals }) => {
		const data = await request.formData();
		const verifyType = data.get('verifyType') as string;
		const target = verifyType === 'email' 
			? locals.user?.email
			: locals.user?.phone;

		if (!target) return fail(400, { message: '未绑定验证目标' });

		const code = generateRandomString(6, '0123456789');
		
		// 保存验证码到数据库（有效期5分钟）
		await db.insert(verification_codes).values({
			id : crypto.randomUUID(),
			target: target!,
			code_type: verifyType as 'email' | 'sms',
			verification_code: code,
			expires_at: new Date(Date.now() + 300000),
			created_at: new Date()
		});

		// 这里添加实际发送验证码的逻辑（邮件/短信服务）
		console.log(`发送验证码到 ${target}: ${code}`);

		return { success: true };
	},

	verify: async ({ request, locals }) => {
		const data = await request.formData();
		const code = data.get('code');
		const verifyType = data.get('verifyType');
		const target = verifyType === 'email' 
			? locals.user?.email
			: locals.user?.phone;
		if (typeof target !== 'string') {
			return fail(400, { message: 'Invalid target' });
		}
		const record = await db
			.select()
			.from(verification_codes)
			.where(eq(verification_codes.target, target))
			.orderBy(verification_codes.created_at)
			.limit(1);

		if (!record[0] || record[0].verification_code !== code) {
			return fail(400, { message: '验证码错误' });
		}

		if (record[0].expires_at < new Date()) {
			return fail(400, { message: '验证码已过期' });
		}

		// 更新用户验证状态
		const updateField = verifyType === 'email' 
			? { email_verified: true }
			: { phone_verified: true };

		if (!locals.user) {
			return fail(400, { message: '用户未登录' })
		};
			
		await db
			.update(users)
			.set(updateField)
			.where(eq(users.id, locals.user.id));

		// 标记验证码为已使用
		await db
			.update(verification_codes)
			.set({ is_used: true })
			.where(eq(verification_codes.id, record[0].id));

		return { success: true };
	}
};
