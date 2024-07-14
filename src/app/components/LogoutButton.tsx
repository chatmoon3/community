'use client'

import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LogoutButton({ className = '' }) {
	const router = useRouter()

	const handleSignOut = async () => {
		await signOut({ redirect: false })
		router.replace('/')
	}

	return (
		<button onClick={handleSignOut} className={className}>
			로그아웃
		</button>
	)
}
