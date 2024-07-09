import { getPostById } from '@/db'
import PostForm from '@/app/components/PostForm'

export default async function EditPostPage({
	params,
}: {
	params: { id: string }
}) {
	const post = await getPostById(params.id)

	if (!post) {
		return <div>게시글이 없습니다.</div>
	}

	return <PostForm initialPost={post} />
}
