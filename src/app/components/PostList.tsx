'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { PostWithAuthor } from '@/types/models'
import { getPosts, searchPosts } from '@/app/lib/post'
import SearchForm from '@/app/components/SearchForm'
import Button from '@/app/components/Button'
import { customFormatDistanceToNow } from '@/utils/dateUtils'

interface PostsListProps {
	initialPosts: PostWithAuthor[]
	initialTotal: number
	isSearchResult?: boolean
	searchTerm?: string
	searchType?: 'title' | 'content' | 'author'
}

export default function PostList({
	initialPosts,
	initialTotal,
	isSearchResult = false,
	searchTerm = '',
	searchType = 'title',
}: PostsListProps) {
	const [page, setPage] = useState<number>(1)
	const { data: session } = useSession()
	const limit = 10

	const { data } = useQuery<{
		posts: PostWithAuthor[]
		total: number
	}>({
		queryKey: isSearchResult
			? ['searchPosts', searchTerm, searchType, page]
			: ['posts', page],
		queryFn: () =>
			isSearchResult
				? searchPosts(searchTerm, searchType, page, limit)
				: getPosts(page, limit),

		initialData: {
			posts: initialPosts,
			total: initialTotal,
		},
	})

	const posts = data?.posts || []
	const totalPosts = data?.total || 0
	const totalPages = Math.ceil(totalPosts / limit)

	const getPageNumbers = (): number[] => {
		const pageNumbers: number[] = []
		let startPage = Math.max(1, page - 2)
		let endPage = Math.min(totalPages, startPage + 4)

		for (let i = startPage; i <= endPage; i++) {
			pageNumbers.push(i)
		}

		return pageNumbers
	}

	if (!posts) {
		return null
	}

	return (
		<div className="container max-w-5xl mx-auto px-4 sm:px-8">
			<div className="py-8">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-2xl font-semibold leading-tight">
						{isSearchResult ? (
							<>
								<span className="font-bold">{searchTerm}</span>
								<span className="text-lg font-light text-gray-600 ml-2">
									검색 결과 {totalPosts}건
								</span>
							</>
						) : (
							'게시판'
						)}
					</h2>
					{!session || isSearchResult ? (
						<></>
					) : (
						<Link href="/posts/create">
							<Button>글쓰기</Button>
						</Link>
					)}
				</div>
				<div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
					<div className="inline-block min-w-full rounded-lg overflow-hidden">
						{/* 데스크탑 */}
						<table className="posts-table min-w-full leading-normal hidden md:table">
							<thead>
								<tr>
									<th className="w-16">번호</th>
									<th className="flex-1">제목</th>
									<th className="w-32">작성자</th>
									<th className="w-32">작성시간</th>
									<th className="w-20">조회수</th>
								</tr>
							</thead>
							<tbody>
								{posts.map((post, index) => (
									<tr key={post.id}>
										<td className="text-sm">
											<p>{totalPosts - (page - 1) * limit - index}</p>
										</td>
										<td>
											<Link
												href={`/posts/${post.id}`}
												className="text-gray-900 whitespace-no-wrap hover:font-semibold hover:text-blue-600 "
											>
												{post.title}
											</Link>
										</td>
										<td className="text-sm">
											<p>{post.authorName}</p>
										</td>
										<td className="text-sm">
											<p>
												{customFormatDistanceToNow(new Date(post.createdAt))}
											</p>
										</td>
										<td className="text-sm">
											<p>{post.viewCount}</p>
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
									className="px-4 py-2 text-sm font-semibold text-gray-800"
									disabled={page === 1}
								>
									이전
								</button>
								{getPageNumbers().map((pageNumber) => (
									<button
										key={pageNumber}
										onClick={() => setPage(pageNumber)}
										className={`px-4 py-2 text-sm font-semibold text-gray-800 relative group`}
									>
										{pageNumber}
										<span
											className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-blue-500 transition-all duration-300 ${
												page === pageNumber ? 'w-4' : 'w-0 group-hover:w-4'
											}`}
										></span>
									</button>
								))}
								<button
									onClick={() =>
										setPage((prev) => Math.min(prev + 1, totalPages))
									}
									className="px-4 py-2 text-sm font-semibold text-gray-800"
									disabled={page === totalPages}
								>
									다음
								</button>
							</div>
						</div>
						<div className="mt-3">
							<SearchForm isNavBar={false} className="max-w-md mx-auto" />
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
