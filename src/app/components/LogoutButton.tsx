'use client'

import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface LogoutButtonProps {
	className?: string
	onClick?: () => void
}
export default function LogoutButton({
	className = '',
	onClick,
}: LogoutButtonProps) {
	const router = useRouter()

	const handleSignOut = async () => {
		await signOut({ redirect: false })
		router.replace('/')
	}

	return (
		<button
			onClick={(e) => {
				if (onClick) onClick()
				handleSignOut()
			}}
			className={className}
		>
			로그아웃
		</button>
	)
}
