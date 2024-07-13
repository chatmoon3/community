import { getPosts } from '@/app/lib/post'
import PostList from '@/app/components/PostList'

// Next.js 캐시 데이터 수명을 3600초로 설정
export const revalidate = 3600

export default async function PostsPage() {
	const initialPage = 1
	const initialLimit = 10
	const { posts, total } = await getPosts(initialPage, initialLimit)

	return <PostList initialPosts={posts} initialTotal={total} />
}
