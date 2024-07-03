import { sql } from '@vercel/postgres'

export async function getUser(email: string) {
	const { rows } = await sql`
    SELECT * FROM users WHERE email = ${email}
  `
	return rows[0]
}

export { sql }
