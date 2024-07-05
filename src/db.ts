import { sql } from '@vercel/postgres'
import { Post, Comment } from '@/types/models'

export async function getUser(email: string) {
	const { rows } = await sql`
    SELECT * FROM users WHERE email = ${email}
  `
	return rows[0]
}

// 회원가입
export async function createUser(
	email: string,
	hashedPassword: string,
	username: string
) {
	try {
		await sql`
      INSERT INTO users (email, password, username)
      VALUES (${email}, ${hashedPassword}, ${username})
    `
	} catch (error) {
		console.error('회원가입 실패:', error)
		throw error
	}
}

export async function checkEmailExists(email: string) {
	const result = await sql`SELECT * FROM users WHERE email = ${email}`
	return result.rows.length > 0
}
