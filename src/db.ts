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
			RETURNING id
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
      users.name AS author_name,
			COUNT(comments.id) AS comment_count
		FROM posts
		JOIN users ON posts.author_id = users.id
		LEFT JOIN comments ON comments.post_id = posts.id
		WHERE posts.id = ${id}
		GROUP BY posts.id, users.name
	`

	if (result.rows.length === 0) {
		return null
	}

	return {
		id: result.rows[0].post_id,
		title: result.rows[0].title,
		content: result.rows[0].content,
		authorId: result.rows[0].author_id,
		createdAt: result.rows[0].created_at,
		updatedAt: result.rows[0].updated_at,
		authorName: result.rows[0].author_name,
		commentCount: result.rows[0].comment_count,
	} as PostWithAuthor
}

export async function updatePost(
	id: string,
	title: string,
	content: string
): Promise<Post> {
	const result = await sql`
    UPDATE posts
    SET title = ${title}, content = ${content}, updated_at = NOW()
    WHERE id = ${id}
    RETURNING id, title, content, author_id AS "authorId", created_at AS "createdAt", updated_at AS "updatedAt"
  `
	return result.rows[0] as Post
}

// comments 삭제가 선행되어야 post 삭제 가능 -> vercel postgres의 트랜잭션 처리 방식
export async function deletePost(id: string): Promise<void> {
	try {
		// 트랜잭션 시작
		await sql`BEGIN`
		// 댓글 삭제
		await sql`DELETE FROM comments WHERE post_id = ${id}`
		// 게시글 삭제
		await sql`DELETE FROM posts WHERE id = ${id}`
		// 트랜잭션 커밋
		await sql`COMMIT`
	} catch (error) {
		// 오류 발생 시 롤백
		await sql`ROLLBACK`
		console.error('deletePost error:', error)
		throw error
	}
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
    SELECT 
      comments.id,
      comments.content,
      comments.post_id,
      comments.author_id,
      comments.created_at,
      comments.updated_at,
      users.name AS author_name
    FROM comments
    JOIN users ON comments.author_id = users.id
    WHERE comments.post_id = ${postId}
  `

	return result.rows.map((row) => ({
		id: row.id,
		content: row.content,
		postId: row.post_id,
		authorId: row.author_id,
		createdAt: row.created_at,
		updatedAt: row.updated_at,
		authorName: row.author_name,
	})) as CommentWithAuthor[]
}

// 수정/삭제 버튼을 작성자일 경우만 보이게끔 해놨지만 이중 보안용
export async function getCommentById(id: string): Promise<Comment | null> {
	const result = await sql`
		SELECT
			id,
			content,
			post_id,
			author_id,
			created_at,
			updated_at
		FROM comments
		WHERE id = ${id}
	`

	if (result.rows.length === 0) {
		return null
	}

	return {
		id: result.rows[0].id,
		content: result.rows[0].content,
		postId: result.rows[0].post_id,
		authorId: result.rows[0].author_id,
		createdAt: result.rows[0].created_at,
		updatedAt: result.rows[0].updated_at,
	} as Comment
}

export async function updateComment(
	id: string,
	content: string
): Promise<Comment> {
	const result = await sql`
		UPDATE comments
		SET content = ${content}, updated_at = NOW()
		WHERE id = ${id}
		RETURNING *
	`

	return result.rows[0] as Comment
}

export async function deleteComment(id: string): Promise<void> {
	await sql`
		DELETE FROM comments
		WHERE id = ${id}
	`
}
