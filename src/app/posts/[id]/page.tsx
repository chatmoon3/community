import { getPostById } from '@/db'
import PostView from '@/app/components/PostView'

export const revalidate = 0

export default async function PostPageById({
	params,
}: {
	params: { id: string }
}) {
	const postId = params.id
	const post = await getPostById(postId)

	if (!post) {
		return <div>게시글이 없습니다.</div>
	}

	return <PostView post={post} />
}
