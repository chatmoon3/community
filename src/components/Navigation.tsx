import Link from 'next/link'

export default function Navigation() {
	return (
		<nav className="mx-auto max-w-7xl bg-blue-600 text-white p-3 px-4 sm:px-6 lg:px-8 rounded-md">
			<div className="container mx-auto flex justify-between items-center">
				<div className="flex space-x-5">
					<Link href="/">홈</Link>
					<Link href="/posts">게시판</Link>
				</div>
				<div className="flex items-center space-x-5">
					<input type="text" placeholder="검색" className="px-2 py-1 rounded" />
					<Link href="login">로그인</Link>
					<Link href="signup">회원가입</Link>
				</div>
			</div>
		</nav>
	)
}
