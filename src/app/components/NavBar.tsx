'use client'

import Link from 'next/link'
import { useState, Suspense } from 'react'
import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import SearchForm from '@/app/components/SearchForm'
import LogoutButton from '@/app/components/LogoutButton'
import Button from '@/app/components/Button'

export default function Navbar() {
	const [MenuOpen, setMenuOpen] = useState(false)
	const { data: session } = useSession()
	const pathname = usePathname()

	return (
		<nav className="relative p-4 bg-white shadow-md">
			<div className="flex items-center max-w-6xl mx-auto">
				<Link href="/" className="text-2xl font-bold text-blue-600">
					COMMUNITY
				</Link>

				<div className="flex justify-center flex-grow">
					<div className="hidden space-x-8 md:flex">
						<Link href="/" className="relative py-2 text-gray-800 group">
							홈
							<span
								className={`absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 transform transition-transform duration-300 group-hover:scale-x-100 ${
									pathname === '/' ? 'scale-x-100' : 'scale-x-0'
								}`}
							></span>
						</Link>
						<Link href="/posts" className="relative py-2 text-gray-800 group">
							게시판
							<span
								className={`absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 transform transition-transform duration-300 group-hover:scale-x-100 ${
									pathname === '/posts' ? 'scale-x-100' : 'scale-x-0'
								}`}
							></span>
						</Link>
					</div>
				</div>

				<div className="items-center hidden space-x-4 md:flex">
					<Suspense>
						<SearchForm isNavBar={true} className="w-64" />
					</Suspense>
					{!session ? (
						<>
							<Link href="/login">
								<Button>로그인</Button>
							</Link>
							<Link href="/signup">
								<Button>회원가입</Button>
							</Link>
						</>
					) : (
						<>
							<Link href="/">
								<Button>프로필</Button>
							</Link>
							<LogoutButton className="px-4 py-2 font-semibold text-sm bg-blue-500 text-white rounded-full shadow-sm hover:bg-blue-600" />
						</>
					)}
				</div>

				<button
					className="ml-auto md:hidden"
					onClick={() => setMenuOpen(!MenuOpen)}
				>
					<svg
						className="w-6 h-6"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M4 6h16M4 12h16M4 18h16"
						/>
					</svg>
				</button>
			</div>

			{/* 모바일 */}
			{MenuOpen && (
				<div className="mt-4 md:hidden">
					<Link href="/" className="block py-2 text-gray-800">
						홈
					</Link>
					<Link href="/posts" className="block py-2 text-gray-800">
						게시판
						<span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
					</Link>
					<Suspense>
						<SearchForm isNavBar={true} className="w-full" />
					</Suspense>
					{!session ? (
						<>
							<Link href="/login">
								<button className="btn-mobile-menu mt-4">로그인</button>
							</Link>
							<Link href="/signup">
								<button className="btn-mobile-menu mt-2">회원가입</button>
							</Link>
						</>
					) : (
						<>
							<Link href="/login">
								<button className="btn-mobile-menu mt-4">프로필</button>
							</Link>
							<LogoutButton className="btn-mobile-menu mt-2" />
						</>
					)}
				</div>
			)}

			<div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-200"></div>
		</nav>
	)
}
