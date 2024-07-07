'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import SignOutButton from '@/app/components/LogOutButton'
import LogOutButton from '@/app/components/LogOutButton'

export default function Navbar() {
	const [MenuOpen, setMenuOpen] = useState(false)
	const { data: session } = useSession()

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
							<span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
						</Link>
						<Link href="/posts" className="relative py-2 text-gray-800 group">
							게시판
							<span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
						</Link>
					</div>
				</div>

				<div className="items-center hidden space-x-4 md:flex">
					{/* 검색 기능 미구현*/}
					{/* <input type="text" placeholder="검색" className="px-2 py-1 rounded" /> */}
					{!session ? (
						<>
							<Link href="/login">
								<button className="w-full px-3 py-1 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600">
									로그인
								</button>
							</Link>
							<Link href="/signup">
								<button className="w-full px-3 py-1 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600">
									회원가입
								</button>
							</Link>
						</>
					) : (
						<>
							<Link href="/login">
								<button className="w-full px-3 py-1 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600">
									프로필
								</button>
							</Link>
							<LogOutButton className="w-full px-3 py-1 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600" />
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
					{/* 검색 기능 미구현*/}
					{/* <input type="text" placeholder="검색" className="px-2 py-1 rounded" /> */}
					{!session ? (
						<>
							<Link href="/login">
								<button className="w-full px-3 py-1 mt-4 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600">
									로그인
								</button>
							</Link>
							<Link href="/signup">
								<button className="w-full px-3 py-1 mt-2 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600">
									회원가입
								</button>
							</Link>
						</>
					) : (
						<>
							<Link href="/login">
								<button className="w-full px-3 py-1 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600">
									프로필
								</button>
							</Link>
							<LogOutButton className="w-full px-3 py-1 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600" />
						</>
					)}
				</div>
			)}

			<div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-200"></div>
		</nav>
	)
}
