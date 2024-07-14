import { getPosts } from '@/app/lib/post'
import PostList from '@/app/components/PostList'

export const revalidate = 60

export default async function PostsPage() {
	const initialPage = 1
	const initialLimit = 10
	const { posts, total } = await getPosts(initialPage, initialLimit)

	return <PostList initialPosts={posts} initialTotal={total} />
}
