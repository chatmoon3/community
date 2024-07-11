'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import CommentList from './CommentList'
import CommentForm from './CommentForm'
import { Post, PostWithAuthor } from '@/types/models'
import { getPostById, deletePost } from '@/app/lib/post'
import { customFormatDistanceToNow } from '@/utils/dateUtils'

interface PostViewProps {
	post: PostWithAuthor
}

export default function PostView({ post: initialPost }: PostViewProps) {
	const router = useRouter()
	const { data: session } = useSession()
	const queryClient = useQueryClient()

	const { data: post } = useQuery<PostWithAuthor>({
		queryKey: ['post', initialPost.id],
		queryFn: async () => {
			const result = await getPostById(initialPost.id)
			if (!result) throw new Error('게시글을 찾을 수 없습니다.')
			return result
		},
		initialData: initialPost,
	})

	const deletePostMutation = useMutation({
		mutationFn: deletePost,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['posts'] })
			router.push('/posts')
		},
		onError: (error) => {
			console.error('게시글 삭제 실패:', error)
		},
	})

	const handleDeletePost = async (postId: string) => {
		if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
			deletePostMutation.mutate(postId)
		}
	}

	return (
		<div className="max-w-4xl mx-auto p-10 mt-12 bg-white border border-gray-200 rounded-lg overflow-hidden">
			<div className="border-b">
				<h1 className="text-3xl font-bold mb-2">{post.title}</h1>
				<div className="flex justify-between items-center mb-2">
					<div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
						<span>{post.authorName}</span>
						<span>•</span>
						<span>{customFormatDistanceToNow(new Date(post.createdAt))}</span>
					</div>
					{session?.user?.id === post.authorId && (
						<div>
							<Link
								href={`/posts/${post.id}/edit`}
								className="mr-2 text-gray-500 text-sm"
							>
								수정
							</Link>
							<button
								onClick={() => handleDeletePost(post.id)}
								className="text-gray-500 text-sm"
							>
								삭제
							</button>
						</div>
					)}
				</div>
			</div>

			<p className="text-gray-700 my-16">{post.content}</p>

			<div className="flex items-center mb-4 space-x-4">
				<span className="flex text-sm mt-2 space-x-1 text-gray-500">
					댓글 {post.commentCount} 개
				</span>
			</div>

			<div className="pt-4 border-t-4">
				<CommentList postId={post.id} />
				<CommentForm postId={post.id} />
			</div>
		</div>
	)
}
