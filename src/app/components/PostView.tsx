'use client'

import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'
import Link from 'next/link'
import CommentList from './CommentList'
import CommentForm from './CommentForm'
import { deletePost } from '@/app/lib/post'
import { PostWithAuthor } from '@/types/models'
import { useRouter } from 'next/navigation'

interface PostViewProps {
	post: PostWithAuthor
}

export default function PostView({ post }: PostViewProps) {
	const router = useRouter()

	const handleDelete = async (postId: string) => {
		if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
			try {
				await deletePost(postId)
				router.push('/posts')
			} catch (error) {
				console.error('게시글 삭제 실패:', error)
			}
		}
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
				<div className="mt-4">
					<Link href={`/posts/${post.id}/edit`} className="mr-4 text-blue-500">
						수정
					</Link>
					<button
						onClick={() => handleDelete(post.id)}
						className="mr-4 text-blue-500"
					>
						삭제
					</button>
				</div>
			</div>
			<CommentList postId={post.id} />
			<CommentForm postId={post.id} />
		</div>
	)
}
