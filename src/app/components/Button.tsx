import React from 'react'
import Link from 'next/link'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	href?: string
	children: React.ReactNode
}

export default function Button({
	href,
	children,
	className,
	...props
}: ButtonProps) {
	const buttonClass = `px-4 py-2 font-semibold text-sm bg-blue-500 text-white rounded-full shadow-sm hover:bg-blue-600 ${
		className || ''
	}`

	if (href) {
		return (
			<Link href={href}>
				<button className={buttonClass} {...props}>
					{children}
				</button>
			</Link>
		)
	}

	return (
		<button className={buttonClass} {...props}>
			{children}
		</button>
	)
}
