import { getPostById } from '@/db'
import CommentList from '@/app/components/CommentList'
import CommentForm from '@/app/components/CommentForm'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'

export const revalidate = 0 // 댓글 작성 시 페이지 재생성

export default async function PostPageById({
	params,
}: {
	params: { id: string }
}) {
	const postId = params.id
	const post = await getPostById(postId)

	if (!post) {
		return <div>Post not found</div>
	}

	return (
		<div className="container max-w-3xl mx-auto my-8">
			<div className="p-6 bg-white rounded-lg shadow-md">
				<h1 className="mb-4 text-2xl font-bold">{post.title}</h1>
				<div className="flex items-center mb-4 text-gray-500">
					<span className="mr-4">{post.authorName}</span>
					<span>
						{formatDistanceToNow(new Date(post.createdAt), {
							addSuffix: true,
							locale: ko,
						})}
					</span>
				</div>
				<p>{post.content}</p>
			</div>
			<CommentList postId={params.id} />
			<CommentForm postId={params.id} />
		</div>
	)
}
