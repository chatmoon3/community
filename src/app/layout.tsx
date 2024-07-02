import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/app/globals.css'
import Navigation from '@/components/Navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'Welcome Community!',
	description: 'This is community',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="ko">
			<body className={inter.className}>
				<Navigation />
				<main className="container mx-auto mt-4 px-4">{children}</main>
			</body>
		</html>
	)
}
