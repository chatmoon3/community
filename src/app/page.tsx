import { getPopularPosts } from '@/app/lib/post'
import PopularPostList from '@/app/components/PopularPostList'

export default async function Home() {
	const posts = await getPopularPosts(10)

	return <PopularPostList initialPosts={posts} />
}
