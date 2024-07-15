'use client'

import Link from 'next/link'
import { useState, useEffect, useRef, Suspense } from 'react'
import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import SearchForm from '@/app/components/SearchForm'
import LogoutButton from '@/app/components/LogoutButton'
import Button from '@/app/components/Button'

export default function Navbar() {
	const [accountMenuOpen, setAccountMenuOpen] = useState(false)
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
	const { data: session } = useSession()
	const pathname = usePathname()
	const ref = useRef<HTMLDivElement>(null)

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (ref.current && !ref.current.contains(event.target as Node)) {
				setAccountMenuOpen(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	const closeAccountMenu = () => {
		setAccountMenuOpen(false)
	}

	return (
		<nav className="relative p-4 bg-white shadow-md">
			<div className="flex items-center max-w-6xl mx-auto">
				<Link href="/" className="text-2xl font-bold text-blue-600">
					COMMUNITY
				</Link>

				{/* 데스크탑 */}
				<div className="hidden md:flex justify-center flex-grow">
					<div className="space-x-8">
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
				<div className="hidden md:flex items-center space-x-4">
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
						<div className="relative" ref={ref}>
							<button
								onClick={() => setAccountMenuOpen(!accountMenuOpen)}
								className="px-4 py-2 font-semibold text-sm bg-blue-500 text-white rounded-full shadow-sm hover:bg-blue-600"
							>
								계정
							</button>
							{accountMenuOpen && (
								<div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
									<Link
										href="/profile/edit"
										className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
										onClick={closeAccountMenu}
									>
										닉네임 수정
									</Link>
									<Link
										href="/profile/change-password"
										className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
										onClick={closeAccountMenu}
									>
										비밀번호 변경
									</Link>
									<Link
										href="/profile/delete"
										className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
										onClick={closeAccountMenu}
									>
										회원탈퇴
									</Link>
									<hr className="my-1" />
									<LogoutButton className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" />
								</div>
							)}
						</div>
					)}
				</div>

				{/* 햄버거 버튼 */}
				<button
					className="md:hidden ml-auto"
					onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
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
			{mobileMenuOpen && (
				<div className="fixed inset-0 bg-gray-800 bg-opacity-75 z-50">
					<div className="flex flex-col h-full bg-white p-4">
						<div className="flex justify-between items-center mb-4">
							<Link href="/" className="text-2xl font-bold text-blue-600">
								COMMUNITY
							</Link>
							<button onClick={() => setMobileMenuOpen(false)}>
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
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						</div>
						<Link href="/" className="py-2 text-gray-800 hover:bg-gray-100">
							홈
						</Link>
						<Link
							href="/posts"
							className="py-2 text-gray-800 hover:bg-gray-100"
						>
							게시판
						</Link>
						<Suspense>
							<SearchForm isNavBar={true} className="w-full my-2" />
						</Suspense>
						{!session ? (
							<>
								<Link
									href="/login"
									className="py-2 text-gray-800 hover:bg-gray-100"
								>
									로그인
								</Link>
								<Link
									href="/signup"
									className="py-2 text-gray-800 hover:bg-gray-100"
								>
									회원가입
								</Link>
							</>
						) : (
							<>
								<hr className="my-2" />
								<div>
									<Link
										href="/profile/edit"
										className="block py-1 text-gray-600 text-sm hover:bg-gray-100"
									>
										닉네임 수정
									</Link>
									<Link
										href="/profile/change-password"
										className="block py-1 text-gray-600 text-sm hover:bg-gray-100"
									>
										비밀번호 변경
									</Link>
									<Link
										href="/profile/delete"
										className="block py-1 text-gray-600 text-sm hover:bg-gray-100"
									>
										회원탈퇴
									</Link>
								</div>
								<hr className="my-2" />
								<LogoutButton className="py-2 text-gray-800 hover:bg-gray-100" />
							</>
						)}
					</div>
				</div>
			)}

			<div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-200"></div>
		</nav>
	)
}
