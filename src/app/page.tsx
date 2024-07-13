import { getPopularPosts } from '@/app/lib/post'
import PopularPostList from '@/app/components/PopularPostList'

// Next.js 캐시 데이터 수명을 3600초로 설정
export const revalidate = 3600

export default async function Home() {
	const posts = await getPopularPosts(10)
	return <PopularPostList initialPosts={posts} />
}
