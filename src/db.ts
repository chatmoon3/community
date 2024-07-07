import { sql } from '@vercel/postgres'
import {
	Post,
	Comment,
	PostWithAuthor,
	CommentWithAuthor,
} from '@/types/models'

export async function getUser(email: string) {
	const { rows } = await sql`
    SELECT * FROM users WHERE email = ${email}
  `
	return rows[0]
}

// signup
export async function createUser(
	id: string,
	email: string,
	hashedPassword: string,
	name: string
) {
	try {
		const result = await sql`
      INSERT INTO users (id, email, password, name)
      VALUES (${id}, ${email}, ${hashedPassword}, ${name})
    `
		return result.rows[0].id
	} catch (error) {
		console.error('회원가입 실패:', error)
		throw error
	}
}

export async function checkEmailExists(email: string) {
	const result = await sql`SELECT * FROM users WHERE email = ${email}`
	return result.rows.length > 0
}

export async function checkUsernameExists(name: string) {
	const result = await sql`SELECT * FROM users WHERE name = ${name}`
	return result.rows.length > 0
}

// posts
export async function createPost(
	title: string,
	content: string,
	authorId: string
): Promise<Post> {
	const result = await sql`
    INSERT INTO posts (title, content, author_id)
    VALUES (${title}, ${content}, ${authorId})
    RETURNING id, title, content, author_id as "authorId", created_at as "createdAt", updated_at as "updatedAt"
  `
	return result.rows[0] as Post
}

export async function getPosts(
	page: number = 1,
	limit: number = 10
): Promise<{ posts: PostWithAuthor[]; total: number }> {
	const offset = (page - 1) * limit

	// SELECT posts.* 로 하면 posts와 users의 id 중복으로 에러
	const result = await sql`
    SELECT
			posts.id AS post_id,
      posts.title,
      posts.content,
      posts.author_id,
      posts.created_at,
      posts.updated_at,
      users.name AS author_name
		FROM posts
		JOIN users ON posts.author_id = users.id
    ORDER BY posts.created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `

	const totalResult = await sql`SELECT COUNT(*) FROM posts`

	return {
		posts: result.rows.map((row) => ({
			id: row.post_id,
			title: row.title,
			content: row.content,
			authorId: row.author_id,
			createdAt: row.created_at,
			updatedAt: row.updated_at,
			authorName: row.author_name,
		})) as PostWithAuthor[],
		total: parseInt(totalResult.rows[0].count),
	}
}

export async function getPostById(id: string): Promise<PostWithAuthor | null> {
	// SELECT posts.* 로 하면 posts와 users의 id 중복으로 에러
	const result = await sql`
		SELECT 
			posts.id AS post_id,
      posts.title,
      posts.content,
      posts.author_id,
      posts.created_at,
      posts.updated_at,
      users.name AS author_name
		FROM posts
		JOIN users ON posts.author_id = users.id
		WHERE posts.id = ${id}
	`
	return result.rows.length > 0
		? ({
				id: result.rows[0].post_id,
				title: result.rows[0].title,
				content: result.rows[0].content,
				authorId: result.rows[0].author_id,
				createdAt: result.rows[0].created_at,
				updatedAt: result.rows[0].updated_at,
				authorName: result.rows[0].author_name,
		  } as PostWithAuthor)
		: null
}

// comment
export async function createComment(
	content: string,
	postId: string,
	authorId: string
): Promise<Comment> {
	const result = await sql`
    INSERT INTO comments (content, post_id, author_id)
    VALUES (${content}, ${postId}, ${authorId})
    RETURNING *
  `
	return result.rows[0] as Comment
}

export async function getCommentsByPostId(
	postId: string
): Promise<CommentWithAuthor[]> {
	const result = await sql`
    SELECT comments.*, users.name AS author_name
    FROM comments
    JOIN users ON comments.author_id = users.id
    WHERE comments.post_id = ${postId}
  `

	return result.rows.map((row) => ({
		...row,
		authorName: row.author_name,
	})) as CommentWithAuthor[]
}
