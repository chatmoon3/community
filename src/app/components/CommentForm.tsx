'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createComment, updateComment } from '@/app/lib/post'

interface CommentProps {
	postId: string
	commentId?: string
	initialContent?: string
	isEditing?: boolean
	onCancel?: () => void
}

export default function CommentForm({
	postId,
	commentId,
	initialContent = '',
	isEditing = false,
	onCancel,
}: CommentProps) {
	const [content, setContent] = useState('')
	const router = useRouter()
	const { data: session } = useSession()
	const queryClient = useQueryClient()

	useEffect(() => {
		setContent(initialContent)
	}, [initialContent])

	const createCommentMutation = useMutation({
		mutationFn: ({ postId, content }: { postId: string; content: string }) =>
			createComment(postId, content),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['comments', postId] })
			router.refresh()
		},
		onError: (error) => {
			console.error('댓글 작성 실패:', error)
		},
	})

	const updateCommentMutation = useMutation({
		mutationFn: ({
			commentId,
			content,
		}: {
			commentId: string
			content: string
		}) => updateComment(commentId, content),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['comments', postId] })
			router.refresh()
		},
		onError: (error) => {
			console.error('댓글 수정 실패:', error)
		},
	})

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!session) {
			alert('로그인 후에 이용해주세요.')
			return
		}

		if (isEditing && commentId) {
			updateCommentMutation.mutate({ commentId, content })
		} else {
			createCommentMutation.mutate({ postId, content })
		}

		setContent('')
		if (onCancel) onCancel()
	}

	return (
		<form
			onSubmit={handleSubmit}
			className="p-4 mt-6 bg-white rounded-lg shadow-md"
		>
			<div className="mb-4">
				<label
					htmlFor="comment"
					className="block mb-2 text-sm font-medium text-gray-700"
				>
					{isEditing ? '댓글 수정' : '댓글 작성'}
				</label>
				<textarea
					id="comment"
					value={content}
					onChange={(e) => setContent(e.target.value)}
					placeholder="댓글을 입력해주세요"
					required
					className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
					rows={4}
				/>
			</div>
			<div className="flex justify-end">
				{isEditing && (
					<button
						type="button"
						onClick={onCancel}
						className="px-4 py-2 font-semibold text-sm bg-blue-500 text-white rounded-full shadow-sm hover:bg-blue-600 disabled:bg-blue-300"
					>
						취소하기
					</button>
				)}
				<button
					type="submit"
					className="px-4 py-2 font-semibold text-sm bg-blue-500 text-white rounded-full shadow-sm hover:bg-blue-600 disabled:bg-blue-300"
				>
					{isEditing ? '수정하기' : '작성하기'}
				</button>
			</div>
		</form>
	)
}
