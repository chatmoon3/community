'use client'

import { useState, useEffect } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'
import { getCommentsByPostId } from '@/app/lib/post'
import { Comment, CommentWithAuthor } from '@/types/models'

export default function CommentList({ postId }: { postId: string }) {
	const [comments, setComments] = useState<CommentWithAuthor[]>([])

	useEffect(() => {
		async function fetchComments() {
			const comments = await getCommentsByPostId(postId)
			setComments(comments)
		}
		fetchComments()
	}, [postId])

	return (
		<div className="mt-8">
			<h2 className="mb-4 text-2xl font-bold">Comments</h2>
			{comments.length === 0 ? (
				<p></p>
			) : (
				<ul className="space-y-4">
					{comments.map((comment) => (
						<li key={comment.id} className="p-4 bg-gray-100 rounded-lg">
							<p className="mb-2">{comment.content}</p>
							<div className="text-sm text-gray-500">
								<span>By: {comment.authorName}</span>
								<span className="ml-4">
									{formatDistanceToNow(new Date(comment.created_at), {
										addSuffix: true,
										locale: ko,
									})}
								</span>
							</div>
						</li>
					))}
				</ul>
			)}
		</div>
	)
}
