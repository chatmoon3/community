import { searchPosts } from '@/app/lib/post'
import PostList from '@/app/components/PostList'

// 검색 결과는 항상 최신 데이터를 보여줘야 함
export const revalidate = 0

export default async function SearchPage({
	searchParams,
}: {
	searchParams: { keyword: string; type: 'title' | 'content' | 'author' }
}) {
	const searchTerm = searchParams.keyword
	const searchType = searchParams.type
	const page = 1
	const limit = 10

	const { posts, total } = await searchPosts(
		searchTerm,
		searchType,
		page,
		limit
	)

	return (
		<div className="container max-w-5xl mx-auto px-4 sm:px-8">
			<PostList
				initialPosts={posts}
				initialTotal={total}
				isSearchResult={true}
				searchTerm={searchTerm}
				searchType={searchType}
			/>
		</div>
	)
}
