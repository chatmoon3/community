import Link from "next/link";

export default function Navigation() {
  return (
    <nav className="bg-blue-700 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex space-x-4">
          <Link href="/" className="hover:text-gray-400">
            홈
          </Link>
          <Link href="/posts">게시판</Link>
        </div>
        <div className="flex items-center space-x-4">
          <input type="text" placeholder="검색" className="px-2 py-1 rounded" />
          <Link href="login">로그인</Link>
          <Link href="signup">회원가입</Link>
        </div>
      </div>
    </nav>
  );
}
