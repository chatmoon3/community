import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/app/globals.css'
import Navbar from '@/app/components/NavBar'

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
				<Navbar />
				<main className="container mx-auto mt-4 px-4">{children}</main>
			</body>
		</html>
	)
}
