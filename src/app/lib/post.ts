'use server'

import {
	createPost as dbCreatePost,
	getPosts as dbGetPosts,
	getPostById as dbGetPostById,
	createComment as dbCreateComment,
	getCommentsByPostId as dbGetCommentsByPostId,
} from '@/db'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/auth'

async function getAuthenticatedUserId() {
	const session = await getServerSession(authOptions)

	if (!session?.user?.id) {
		throw new Error('사용자가 인증되지 않았습니다.')
	}
	return session.user.id
}

export async function createPost(title: string, content: string) {
	const authorId = await getAuthenticatedUserId()
	return dbCreatePost(title, content, authorId)
}

export async function getPosts(page: number, limit: number) {
	const { posts, total } = await dbGetPosts(page, limit)
	return { posts, total }
}

export async function getPostById(id: string) {
	return dbGetPostById(id)
}

export async function createComment(
	postId: string,
	content: string,
	authorId: string
) {
	return dbCreateComment(content, postId, authorId)
}

export async function getCommentsByPostId(postId: string) {
	return dbGetCommentsByPostId(postId)
}
