'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { createPost } from '@/app/lib/post'

export default function PostForm() {
	const [title, setTitle] = useState('')
	const [content, setContent] = useState('')
	const { data: session } = useSession()
	const router = useRouter()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!session) {
			alert('로그인 후에 이용해주세요.')
			return
		}
		try {
			await createPost(title, content)
			router.push('/posts')
		} catch (error) {
			console.error('게시글 작성 실패:', error)
		}
	}

	return (
		<div className="container max-w-3xl mx-auto my-8">
			<div className="p-6 bg-white rounded-lg shadow-md">
				<h1 className="mb-4 text-2xl font-bold">새 게시글 작성</h1>
				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<label htmlFor="title" className="block mb-2 font-medium">
							제목
						</label>
						<input
							type="text"
							id="title"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							className="w-full px-3 py-2 border rounded-md"
							required
						/>
					</div>
					<div className="mb-4">
						<label htmlFor="content" className="block mb-2 font-medium">
							내용
						</label>
						<textarea
							id="content"
							value={content}
							onChange={(e) => setContent(e.target.value)}
							className="w-full h-32 px-3 py-2 border rounded-md"
							required
						></textarea>
					</div>
					<button
						type="submit"
						className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
					>
						작성
					</button>
				</form>
			</div>
		</div>
	)
}
