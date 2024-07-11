'use client'

import Link from 'next/link'
import { PostWithAuthor } from '@/types/models'
import { customFormatDistanceToNow } from '@/utils/dateUtils'
import { useQuery } from '@tanstack/react-query'
import { getPopularPosts } from '@/app/lib/post'

interface PopularPostsListProps {
	initialPosts: PostWithAuthor[]
}

export default function PopularPostList({
	initialPosts,
}: PopularPostsListProps) {
	const { data: posts } = useQuery<PostWithAuthor[]>({
		queryKey: ['popularPosts'],
		queryFn: () => getPopularPosts(10),
		initialData: initialPosts,
	})

	if (!posts) {
		return
	}

	return (
		<div className="container max-w-5xl mx-auto px-4 sm:px-8">
			<div className="py-8">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-2xl font-semibold leading-tight">인기글</h2>
				</div>
				<div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
					<div className="inline-block min-w-full rounded-lg overflow-hidden">
						{/* 데스크탑 */}
						<table className="min-w-full leading-normal hidden md:table">
							<thead>
								<tr>
									<th className="w-16 px-4 py-4 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
										순위
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
									<th className="w-20 px-4 py-4 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
										조회수
									</th>
								</tr>
							</thead>
							<tbody>
								{posts.map((post, index) => (
									<tr key={post.id}>
										<td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
											<p className="text-gray-900 whitespace-no-wrap">
												{index + 1}
											</p>
										</td>
										<td className="px-5 py-5 border-b border-gray-200 bg-white">
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
										<td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
											<p className="text-gray-900 whitespace-no-wrap">
												{post.viewCount}
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
					</div>
				</div>
			</div>
		</div>
	)
}
