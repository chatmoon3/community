'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { PostWithAuthor } from '@/types/models'
import { getPosts } from '@/app/lib/post'
import { customFormatDistanceToNow } from '@/utils/dateUtils'

interface PostsListProps {
	initialPosts: PostWithAuthor[]
	initialTotal: number
}

export default function PostList({
	initialPosts,
	initialTotal,
}: PostsListProps) {
	const [posts, setPosts] = useState<PostWithAuthor[]>(initialPosts)
	const [totalPosts, setTotalPosts] = useState<number>(initialTotal)
	const [page, setPage] = useState<number>(1)
	const limit = 10

	const totalPages = Math.ceil(totalPosts / limit)

	useEffect(() => {
		async function fetchPosts() {
			const { posts, total } = await getPosts(page, limit)
			setPosts(posts)
			setTotalPosts(total)
		}
		fetchPosts()
	}, [page])

	return (
		<div className="container max-w-5xl mx-auto px-4 sm:px-8">
			<div className="py-8">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-2xl font-semibold leading-tight">게시판</h2>
					<Link
						href="/posts/create"
						className="px-4 py-2 font-semibold text-sm bg-blue-500 text-white rounded-full shadow-sm hover:bg-blue-600"
					>
						글쓰기
					</Link>
				</div>
				<div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
					<div className="inline-block min-w-full rounded-lg overflow-hidden">
						{/* 데스크탑 */}
						<table className="min-w-full leading-normal hidden md:table">
							<thead>
								<tr>
									<th className="w-16 px-4 py-4 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
										번호
									</th>
									<th className="flex-1 px-4 py-4 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
										제목
									</th>
									<th className="w-32 px-4 py-4 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
										작성자
									</th>
									<th className="w-32 px-4 py-4 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
										작성시간
									</th>
								</tr>
							</thead>
							<tbody>
								{posts.map((post, index) => (
									<tr key={post.id}>
										<td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
											<p className="text-gray-900 whitespace-no-wrap">
												{totalPosts - (page - 1) * limit - index}
											</p>
										</td>
										<td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
											<Link
												href={`/posts/${post.id}`}
												className="text-gray-900 whitespace-no-wrap hover:text-blue-600"
											>
												{post.title}
											</Link>
										</td>
										<td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
											<p className="text-gray-900 whitespace-no-wrap">
												{post.authorName}
											</p>
										</td>
										<td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
											<p className="text-gray-900 whitespace-no-wrap">
												{customFormatDistanceToNow(new Date(post.createdAt))}
											</p>
										</td>
									</tr>
								))}
							</tbody>
						</table>

						{/* 모바일 */}
						<table className="min-w-full leading-normal md:hidden">
							<thead>
								<tr>
									<th className="flex-1 px-4 py-4 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
										제목
									</th>
									<th className="w-32 px-4 py-4 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
										작성자
									</th>
								</tr>
							</thead>
							<tbody>
								{posts.map((post) => (
									<tr key={post.id}>
										<td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
											<Link
												href={`/posts/${post.id}`}
												className="text-gray-900 whitespace-no-wrap hover:text-blue-600"
											>
												{post.title}
											</Link>
										</td>
										<td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
											<p className="text-gray-900 whitespace-no-wrap">
												{post.authorName}
											</p>
										</td>
									</tr>
								))}
							</tbody>
						</table>
						<div className="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between">
							<div className="inline-flex mt-2 xs:mt-0">
								<button
									onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
									className="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-700 text-white font-semibold shadow-sm rounded-l-full"
									disabled={page === 1}
								>
									이전
								</button>
								<div className="w-2"></div>
								<button
									onClick={() =>
										setPage((prev) => Math.min(prev + 1, totalPages))
									}
									className="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-700 text-white font-semibold shadow-sm rounded-r-full"
									disabled={page === totalPages}
								>
									다음
								</button>
							</div>
							<span className="text-xs xs:text-sm mt-5 text-gray-900">
								{page} / {totalPages} 페이지
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
