'use server'

import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import { redirect } from 'next/navigation'
import { createUser, checkEmailExists, checkUsernameExists } from '@/db'

export async function signUp(prevState: any, formData: FormData) {
	const id = uuidv4() as string
	const email = formData.get('email') as string
	const password = formData.get('password') as string
	const confirmPassword = formData.get('confirmPassword') as string
	const name = formData.get('name') as string

	if (await checkEmailExists(email)) {
		return { message: '이미 가입된 이메일입니다.' }
	}

	if (await checkUsernameExists(name)) {
		return { message: '이미 사용 중인 닉네임입니다.' }
	}

	const hashedPassword = await bcrypt.hash(password, 10)

	try {
		await createUser(id, email, hashedPassword, name)
	} catch (error) {
		console.error('회원가입 에러:', error)
		return { message: '회원가입을 실패했습니다. 다시 시도해주세요.' }
	}

	redirect('/login')
}
