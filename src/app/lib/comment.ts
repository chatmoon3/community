import { getAuthenticatedUserId } from '@/app/lib/user'

import {
	createComment as dbCreateComment,
	getCommentsByPostId as dbGetCommentsByPostId,
	updateComment as dbUpdateComment,
	deleteComment as dbDeleteComment,
	getCommentById,
} from '@/db'

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
