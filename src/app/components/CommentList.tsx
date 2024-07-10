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
			setComments(comments)
		}
		fetchComments()
	}, [postId])

	const handleDelete = async (commentId: string) => {
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
						<li key={comment.id} className="p-4 bg-gray-100 rounded-lg">
							{editingCommentId === comment.id ? (
								<CommentForm
									postId={postId}
									commentId={comment.id}
									initialContent={comment.content}
									isEditing={true}
									onCancel={() => setEditingCommentId(null)}
								/>
							) : (
								<>
									<p className="mb-2">{comment.content}</p>
									<div className="text-sm text-bla">
										<span>By: {comment.authorName}</span>
										<span className="ml-4">
											{customFormatDistanceToNow(new Date(comment.createdAt))}
										</span>
										{session?.user?.id === comment.authorId && (
											<div className="mt-2">
												<button
													onClick={() => setEditingCommentId(comment.id)}
													className="mr-3 text-gray-500"
												>
													수정
												</button>
												<button
													onClick={() => handleDelete(comment.id)}
													className="text-gray-500"
												>
													삭제
												</button>
											</div>
										)}
									</div>
								</>
							)}
						</li>
					))}
				</ul>
			)}
		</div>
	)
}
