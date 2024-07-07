import NextAuth from 'next-auth'

declare module 'next-auth' {
	interface Session {
		user: {
			id: string
			email: string
			name: string
			image?: string
		}
	}
}

// nextauth의 session에는 id가 없기 때문에 id를 사용하기 위한 설정
