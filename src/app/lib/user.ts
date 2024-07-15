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
	updateUsername as dbUpdateUsername,
	getStoredPassword,
	updatePassword as dbUpdatePassword,
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

export async function updateUsername(userId: string, newUsername: string) {
	try {
		const authenticatedUserId = await getAuthenticatedUserId()
		if (userId !== authenticatedUserId) {
			throw new Error('권한이 없습니다.')
		}

		await dbUpdateUsername(userId, newUsername)
		return {}
	} catch (error) {
		console.error('닉네임 수정 에러:', error)
		return { message: '닉네임 수정에 실패했습니다. 다시 시도해주세요.' }
	}
}

export async function updatePassword(
	userId: string,
	currentPassword: string,
	newPassword: string
) {
	try {
		const authenticatedUserId = await getAuthenticatedUserId()
		if (userId !== authenticatedUserId) {
			throw new Error('권한이 없습니다.')
		}

		const storedPassword = await getStoredPassword(userId)
		if (!storedPassword) {
			throw new Error('사용자를 찾을 수 없습니다.')
		}

		const isPasswordValid = await bcrypt.compare(
			currentPassword,
			storedPassword
		)
		if (!isPasswordValid) {
			throw new Error('현재 비밀번호가 일치하지 않습니다.')
		}

		const hashedNewPassword = await bcrypt.hash(newPassword, 10)

		await dbUpdatePassword(userId, hashedNewPassword)
		return {}
	} catch (error) {
		console.error('비밀번호 변경 에러:', error)
		return {
			message:
				error instanceof Error
					? error.message
					: '비밀번호 변경에 실패했습니다. 다시 시도해주세요.',
		}
	}
}

export async function deleteUser(userId: string) {
	try {
		const authenticatedUserId = await getAuthenticatedUserId()
		if (userId !== authenticatedUserId) {
			throw new Error('권한이 없습니다.')
		}
		await dbDeleteUser(userId)
		return {}
	} catch (error) {
		console.error('계정 삭제 에러:', error)
		return { message: '계정 삭제에 실패했습니다. 다시 시도해주세요.' }
	}
}
