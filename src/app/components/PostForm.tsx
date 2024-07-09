'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { createPost, updatePost } from '@/app/lib/post'

interface PostFormProps {
	initialPost?: {
		id: string
		title: string
		content: string
	}
}

export default function PostForm({ initialPost }: PostFormProps) {
	const [title, setTitle] = useState(initialPost?.title || '')
	const [content, setContent] = useState(initialPost?.content || '')
	const { data: session } = useSession()
	const router = useRouter()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!session) {
			alert('로그인 후에 이용해주세요.')
			return
		}
		try {
			if (initialPost) {
				await updatePost(initialPost.id, title, content)
				router.push(`/posts/${initialPost.id}`)
			} else {
				const { id } = await createPost(title, content)
				router.push(`/posts/${id}`)
			}
		} catch (error) {
			console.error(
				console.error(
					initialPost ? '게시글 수정 실패:' : '게시글 작성 실패:',
					error
				)
			)
		}
	}

	return (
		<div className="container max-w-3xl mx-auto my-8">
			<div className="p-6 bg-white rounded-lg shadow-md">
				<h1 className="mb-4 text-2xl font-bold">
					{initialPost ? '게시글 수정' : '새 게시글 작성'}
				</h1>
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
						{initialPost ? '수정' : '작성'}
					</button>
				</form>
			</div>
		</div>
	)
}
