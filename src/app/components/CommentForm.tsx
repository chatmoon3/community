'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { createComment } from '@/app/lib/post'

export default function CommentForm({ postId }: { postId: string }) {
	const [content, setContent] = useState('')
	const router = useRouter()
	const { data: session } = useSession()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!session) {
			alert('로그인 후에 이용해주세요.')
			return
		}
		try {
			await createComment(postId, content, session.user.id)
			setContent('')
			router.refresh()
		} catch (error) {
			console.error('댓글 작성 실패:', error)
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
					댓글 작성
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
				<button
					type="submit"
					className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
				>
					댓글 작성
				</button>
			</div>
		</form>
	)
}