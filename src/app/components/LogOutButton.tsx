'use client'

import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LogOutButton() {
	const router = useRouter()

	const handleSignOut = async () => {
		await signOut({ redirect: false })
		router.replace('/') // 로그아웃 후 홈페이지로 리다이렉트
	}

	return (
		<button onClick={handleSignOut} className="">
			로그아웃
		</button>
	)
}
