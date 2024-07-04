import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcrypt'
import { getUser } from '@/db'

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				email: { label: 'Email', type: 'email' },
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					return null
				}

				const user = await getUser(credentials.email)

				if (
					!user ||
					!(await bcrypt.compare(credentials.password, user.password))
				) {
					return null
				}

				return {
					id: user.id.toString(),
					email: user.email,
					name: user.name,
				}
			},
		}),
	],
	pages: {
		signIn: '/login',
	},
}
