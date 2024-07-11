'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getCommentsByPostId, deleteComment } from '@/app/lib/post'
import { CommentWithAuthor } from '@/types/models'
import { customFormatDistanceToNow } from '@/utils/dateUtils'
import CommentForm from '@/app/components/CommentForm'

export default function CommentList({ postId }: { postId: string }) {
	const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
	const router = useRouter()
	const { data: session } = useSession()
	const queryClient = useQueryClient()

	const { data: comments = [] } = useQuery<CommentWithAuthor[]>({
		queryKey: ['comments', postId],
		queryFn: () => getCommentsByPostId(postId),
		select: (data) =>
			data.sort(
				(a, b) =>
					new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
			),
	})

	const deleteMutation = useMutation({
		mutationFn: deleteComment,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['comments', postId] })
			router.refresh()
		},
		onError: (error) => {
			console.error('댓글 삭제 실패:', error)
		},
	})

	const handleDeleteComment = async (commentId: string) => {
		if (window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
			deleteMutation.mutate(commentId)
		}
	}

	return (
		<div className="mt-8">
			{comments.length === 0 ? (
				<p>아직 댓글이 없습니다.</p>
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
