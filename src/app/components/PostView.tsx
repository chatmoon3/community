'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import CommentList from './CommentList'
import CommentForm from './CommentForm'
import { useRouter } from 'next/navigation'
import { PostWithAuthor } from '@/types/models'
import { getPostById, deletePost } from '@/app/lib/post'
import { customFormatDistanceToNow } from '@/utils/dateUtils'

interface PostViewProps {
	post: PostWithAuthor
}

export default function PostView({ post }: PostViewProps) {
	const [currentPost, setCurrentPost] = useState<PostWithAuthor>(post)
	const router = useRouter()
	const { data: session } = useSession()

	useEffect(() => {
		async function fetchPost() {
			const updatedPost = await getPostById(post.id)
			if (updatedPost) {
				setCurrentPost(updatedPost)
			}
		}
		fetchPost()
	}, [post.id])

	const handleDeletePost = async (postId: string) => {
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
		<div className="max-w-4xl mx-auto p-10 mt-12 bg-white border border-gray-200 rounded-lg overflow-hidden">
			<div className="border-b">
				<h1 className="text-3xl font-bold mb-2">{currentPost.title}</h1>
				<div className="flex justify-between items-center mb-2">
					<div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
						<span>{currentPost.authorName}</span>
						<span>•</span>
						<span>
							{customFormatDistanceToNow(new Date(currentPost.createdAt))}
						</span>
					</div>
					{session?.user?.id === currentPost.authorId && (
						<div>
							<Link
								href={`/posts/${currentPost.id}/edit`}
								className="mr-2 text-gray-500 text-sm"
							>
								수정
							</Link>
							<button
								onClick={() => handleDeletePost(currentPost.id)}
								className="text-gray-500 text-sm"
							>
								삭제
							</button>
						</div>
					)}
				</div>
			</div>

			<p className="text-gray-700 my-16">{currentPost.content}</p>

			<div className="flex items-center mb-4 space-x-4">
				<span className="flex text-sm mt-2 space-x-1 text-gray-500">
					댓글 {currentPost.commentCount}
				</span>
			</div>

			<div className="pt-4 border-t-4">
				<CommentList postId={currentPost.id} />
				<CommentForm postId={currentPost.id} />
			</div>
		</div>
	)
}
