'use server'

import {
	createPost as dbCreatePost,
	getPosts as dbGetPosts,
	getPostById as dbGetPostById,
	updatePost as dbUpdatePost,
	deletePost as dbDeletePost,
	createComment as dbCreateComment,
	getCommentsByPostId as dbGetCommentsByPostId,
	updateComment as dbUpdateComment,
	deleteComment as dbDeleteComment,
	getCommentById,
} from '@/db'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/auth'

async function getAuthenticatedUserId() {
	try {
		const session = await getServerSession(authOptions)
		if (!session?.user?.id) {
			throw new Error('사용자가 인증되지 않았습니다.')
		}
		return session.user.id
	} catch (error) {
		console.error('authentication error:', error)
		throw new Error('인증 과정에서 오류가 발생했습니다.')
	}
}

export async function createPost(title: string, content: string) {
	try {
		const userId = await getAuthenticatedUserId()
		return await dbCreatePost(title, content, userId)
	} catch (error) {
		console.error('createPost error:', error)
		throw new Error('게시글 생성 중 오류가 발생했습니다.')
	}
}

export async function getPosts(page: number, limit: number) {
	try {
		return await dbGetPosts(page, limit)
	} catch (error) {
		console.error('getposts error:', error)
		throw new Error('게시글 목록을 가져오는 중 오류가 발생했습니다.')
	}
}

export async function getPostById(id: string) {
	try {
		return await dbGetPostById(id)
	} catch (error) {
		console.error('getPostById error:', error)
		throw new Error('게시글을 가져오는 중 오류가 발생했습니다.')
	}
}

export async function updatePost(id: string, title: string, content: string) {
	const userId = await getAuthenticatedUserId()
	const post = await getPostById(id)

	if (!post) {
		throw new Error('게시글을 찾을 수 없습니다.')
	}

	if (post.authorId !== userId) {
		throw new Error('권한이 없습니다.')
	}

	return await dbUpdatePost(id, title, content)
}

export async function deletePost(id: string) {
	const userId = await getAuthenticatedUserId()
	const post = await getPostById(id)

	if (!post) {
		throw new Error('게시글을 찾을 수 없습니다.')
	}

	if (post.authorId !== userId) {
		throw new Error('권한이 없습니다.')
	}

	return await dbDeletePost(id)
}

export async function createComment(postId: string, content: string) {
	const userId = await getAuthenticatedUserId()
	try {
		return await dbCreateComment(content, postId, userId)
	} catch (error) {
		console.error('createComment error:', error)
		throw new Error('댓글 생성 중 오류가 발생했습니다.')
	}
}

export async function getCommentsByPostId(postId: string) {
	try {
		return await dbGetCommentsByPostId(postId)
	} catch (error) {
		console.error('getCommentsByPostId error:', error)
		throw new Error('댓글 목록을 가져오는 중 오류가 발생했습니다.')
	}
}

export async function updateComment(commentId: string, content: string) {
	try {
		const userId = await getAuthenticatedUserId()
		const comment = await getCommentById(commentId)

		if (!comment) {
			throw new Error('댓글을 찾을 수 없습니다.')
		}

		if (comment.authorId !== userId) {
			throw new Error('권한이 없습니다.')
		}

		return await dbUpdateComment(commentId, content)
	} catch (error) {
		console.error('updateComment error:', error)
		throw new Error('댓글 수정 중 오류가 발생했습니다.')
	}
}

export async function deleteComment(commentId: string) {
	try {
		const userId = await getAuthenticatedUserId()
		const comment = await getCommentById(commentId)

		if (!comment) {
			throw new Error('댓글을 찾을 수 없습니다.')
		}

		if (comment.authorId !== userId) {
			throw new Error('권한이 없습니다.')
		}

		await dbDeleteComment(commentId)
	} catch (error) {
		console.error('deleteComment error:', error)
		throw new Error('댓글 삭제 중 오류가 발생했습니다.')
	}
}
