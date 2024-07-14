'use server'

import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/auth'
import {
	createUser,
	checkEmailExists,
	checkUsernameExists,
	updateUser as dbUpdateUser,
	deleteUser as dbDeleteUser,
} from '@/db'

export async function getAuthenticatedUserId() {
	try {
		const session = await getServerSession(authOptions)
		if (!session?.user?.id) {
			throw new Error('사용자가 인증되지 않았습니다.')
		}
		return session.user.id
	} catch (error) {
		console.error('authentication error:', error)
		throw new Error('인증 과정에서 오류가 발생했습니다.')
	}
}

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

export async function updateUser(prevState: any, formData: FormData) {
	const userId = formData.get('userId') as string
	const name = formData.get('name') as string
	const password = formData.get('password') as string

	try {
		const authenticatedUserId = await getAuthenticatedUserId()

		if (userId !== authenticatedUserId) {
			throw new Error('권한이 없습니다.')
		}

		await dbUpdateUser(userId, name, password)
	} catch (error) {
		console.error('프로필 업데이트 에러:', error)
		return { message: '프로필 업데이트에 실패했습니다. 다시 시도해주세요.' }
	}
}

export async function deleteUserAccount(userId: string) {
	try {
		const authenticatedUserId = await getAuthenticatedUserId()

		if (userId !== authenticatedUserId) {
			throw new Error('권한이 없습니다.')
		}
		await dbDeleteUser(userId)
	} catch (error) {
		console.error('계정 삭제 에러:', error)
		return { message: '계정 삭제에 실패했습니다. 다시 시도해주세요.' }
	}
}
