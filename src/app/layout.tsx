import type { Metadata } from 'next'
import { Noto_Sans } from 'next/font/google'
import '@/app/globals.css'
import Navbar from '@/app/components/NavBar'
import AuthSession from '@/app/components/AuthSession'
import QueryProvider from '@/app/components/QueryProvider'

const notoSans = Noto_Sans({
	weight: ['400', '700'],
	subsets: ['latin'],
	display: 'swap',
})

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
			<body className={notoSans.className}>
				<AuthSession>
					<QueryProvider>
						<Navbar />
						<main className="container mx-auto mt-4 px-4">{children}</main>
					</QueryProvider>
				</AuthSession>
			</body>
		</html>
	)
}
