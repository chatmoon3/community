export interface User {
	id: string
	email: string
	name: string
	password: string
	createdAt: Date
}

export interface Post {
	id: string
	title: string
	content: string
	authorId: string
	createdAt: Date
	updatedAt: Date
}

export interface Comment {
	id: string
	content: string
	postId: string
	authorId: string
	createdAt: Date
	updatedAt: Date
}

export interface PostWithAuthor extends Post {
	authorName: string
}

export interface CommentWithAuthor extends Comment {
	authorName: string
}
