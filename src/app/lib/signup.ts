'use server'

import bcrypt from 'bcrypt'
import { redirect } from 'next/navigation'
import { checkEmailExists, createUser } from '@/db'

export async function signUp(prevState: any, formData: FormData) {
	const email = formData.get('email') as string
	const password = formData.get('password') as string
	const confirmPassword = formData.get('confirmPassword') as string
	const username = formData.get('username') as string

	// html 입력 유효성 검사로 필요없음
	if (!email || !password || !confirmPassword || !username) {
		return { message: '모든 필드를 입력해주세요.' }
	}

	if (await checkEmailExists(email)) {
		return { message: '이미 가입된 이메일입니다.' }
	}

	const hashedPassword = await bcrypt.hash(password, 10)

	try {
		await createUser(email, hashedPassword, username)
		redirect('/login')
	} catch (error) {
		console.error('회원가입 에러:', error)
		return { message: '회원가입을 실패했습니다. 다시 시도해주세요.' }
	}
}
