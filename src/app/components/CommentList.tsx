'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { getCommentsByPostId, deleteComment } from '@/app/lib/post'
import { CommentWithAuthor } from '@/types/models'
import { customFormatDistanceToNow } from '@/utils/dateUtils'
import CommentForm from '@/app/components/CommentForm'

export default function CommentList({ postId }: { postId: string }) {
	const [comments, setComments] = useState<CommentWithAuthor[]>([])
	const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
	const { data: session } = useSession()

	useEffect(() => {
		async function fetchComments() {
			const comments = await getCommentsByPostId(postId)
			const sortedComments = comments.sort(
				(a, b) =>
					new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
			)
			setComments(sortedComments)
		}
		fetchComments()
	}, [postId])

	const handleDeleteComment = async (commentId: string) => {
		if (window.confirm('정말로 이 댓글을 삭제하기겠습니까?')) {
			try {
				await deleteComment(commentId)
				setComments(comments.filter((c) => c.id !== commentId))
			} catch (error) {
				console.error('댓글 삭제 실패:', error)
			}
		}
	}

	return (
		<div className="mt-8">
			{comments.length === 0 ? (
				<p></p>
			) : (
				<ul className="space-y-4">
					{comments.map((comment) => (
						<li key={comment.id} className="p-4">
							{editingCommentId === comment.id ? (
								<CommentForm
									postId={postId}
									commentId={comment.id}
									initialContent={comment.content}
									isEditing={true}
									onCancel={() => setEditingCommentId(null)}
								/>
							) : (
								<div className="border-b py-2">
									<div className="flex justify-between items-center mb-2">
										<div className="flex items-center space-x-2 text-sm text-gray-500">
											<span>{comment.authorName}</span>
											<span>•</span>
											<span>
												{customFormatDistanceToNow(new Date(comment.createdAt))}
											</span>
										</div>
										{session?.user?.id === comment.authorId && (
											<div>
												<button
													onClick={() => setEditingCommentId(comment.id)}
													className="text-sm text-gray-500 mr-2"
												>
													수정
												</button>
												<button
													onClick={() => handleDeleteComment(comment.id)}
													className="text-sm text-gray-500 hover:text-black"
												>
													삭제
												</button>
											</div>
										)}
									</div>
									<p className="text-gray-700">{comment.content}</p>
								</div>
							)}
						</li>
					))}
				</ul>
			)}
		</div>
	)
}
