'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'
import { PostWithAuthor } from '@/types/models'
import { getPosts } from '@/app/lib/post'

interface PostsListProps {
	initialPosts: PostWithAuthor[]
	initialTotal: number
}

export default function PostList({
	initialPosts,
	initialTotal,
}: PostsListProps) {
	const [posts, setPosts] = useState<PostWithAuthor[]>(initialPosts)
	const [totalPages, setTotalPages] = useState<number>(initialTotal)
	const [page, setPage] = useState<number>(1)
	const limit = 10

	useEffect(() => {
		async function fetchPosts() {
			const { posts, total } = await getPosts(page, limit)
			setPosts(posts)
			setTotalPages(total)
		}

		fetchPosts()
	}, [page])

	return (
		<div className="">
			<div className="container max-w-5xl py-8 mx-auto">
				<div className="flex items-center justify-between mb-6">
					<Link
						href="/posts/create"
						className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
					>
						글쓰기
					</Link>
				</div>
				<table className="w-full border-collapse">
					<thead className="border-t border-b border-black">
						<tr className="">
							<th className="w-16 px-4 py-4">번호</th>
							<th className="flex-1 px-4 py-4">제목</th>
							<th className="w-32 px-4 py-4">작성자</th>
							<th className="w-32 px-4 py-4">작성시간</th>
						</tr>
					</thead>
					<tbody>
						{posts.map((post, index) => (
							<tr
								key={post.id}
								className="transition-colors duration-300 border-b border-gray-200 hover:bg-gray-200"
							>
								<td className="px-4 py-4 text-center">
									{totalPages - (page - 1) * limit - index}
								</td>
								<td className="px-4 py-4">
									<Link
										href={`/posts/${post.id}`}
										className="block font-semibold hover:underline"
									>
										{post.title}
									</Link>
								</td>
								<td className="w-32 px-4 py-4 text-center">
									{post.authorName}
								</td>
								<td className="w-32 px-4 py-4 text-center">
									{formatDistanceToNow(new Date(post.createdAt), {
										addSuffix: true,
										locale: ko,
									})}
								</td>
							</tr>
						))}
					</tbody>
				</table>
				<div className="flex justify-center mt-6">페이지네이션</div>
			</div>
		</div>
	)
}
