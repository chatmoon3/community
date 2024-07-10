'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
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

	useEffect(() => {
		setContent(initialContent)
	}, [initialContent])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!session) {
			alert('로그인 후에 이용해주세요.')
			return
		}
		try {
			if (isEditing && commentId) {
				await updateComment(commentId, content)
			} else {
				await createComment(postId, content)
			}
			setContent('')
			if (onCancel) onCancel()
			router.refresh()
		} catch (error) {
			console.error(isEditing ? '댓글 수정 실패:' : '댓글 작성 실패:', error)
		}
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
						className="px-4 py-2 mr-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
					>
						취소하기
					</button>
				)}
				<button
					type="submit"
					className="px-4 py-2 font-semibold text-sm bg-blue-500 text-white rounded-full shadow-sm hover:bg-blue-600"
				>
					{isEditing ? '수정하기' : '작성하기'}
				</button>
			</div>
		</form>
	)
}
