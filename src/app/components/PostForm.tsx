'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
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
	const queryClient = useQueryClient()

	useEffect(() => {
		if (initialPost) {
			setTitle(initialPost.title)
			setContent(initialPost.content)
		}
	}, [initialPost])

	const createPostMutation = useMutation({
		mutationFn: ({ title, content }: { title: string; content: string }) =>
			createPost(title, content),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ['posts'] })
			router.push(`/posts/${data.id}`)
		},
		onError: (error) => {
			console.error('게시글 작성 실패:', error)
		},
	})

	const updatePostMutation = useMutation({
		mutationFn: ({
			id,
			title,
			content,
		}: {
			id: string
			title: string
			content: string
		}) => updatePost(id, title, content),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ['posts', variables.id] })
			router.push(`/posts/${variables.id}`)
		},
		onError: (error) => {
			console.error('게시글 수정 실패:', error)
		},
	})

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!session) {
			alert('로그인 후에 이용해주세요.')
			return
		}

		if (initialPost) {
			updatePostMutation.mutate({ id: initialPost.id, title, content })
		} else {
			createPostMutation.mutate({ title, content })
		}
	}

	return (
		<main className="flex items-center justify-center min-h-[calc(100vh-90px)] transform -translate-y-8">
			<div className="container max-w-3xl mx-auto">
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
						<div className="flex justify-end">
							<button
								type="submit"
								className="px-4 py-2 font-semibold text-sm bg-blue-500 text-white rounded-full shadow-sm hover:bg-blue-600"
							>
								{initialPost ? '수정' : '작성'}
							</button>
						</div>
					</form>
				</div>
			</div>
		</main>
	)
}
