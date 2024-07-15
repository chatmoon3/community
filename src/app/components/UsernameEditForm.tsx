'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { updateUsername } from '@/app/lib/user'

export default function UsernameEditForm() {
	const { data: session, update: updateSession } = useSession()
	const [newUsername, setNewUsername] = useState('')
	const [status, setStatus] = useState({ success: false, message: '' })

	useEffect(() => {
		if (session?.user?.name) {
			setNewUsername(session.user.name)
		}
	}, [session])

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setStatus({ success: false, message: '' })

		if (!session?.user?.id) {
			setStatus({ success: false, message: '사용자 정보를 찾을 수 없습니다.' })
			return
		}

		if (newUsername === session.user.name) {
			setStatus({ success: false, message: '현재 닉네임과 동일합니다.' })
			return
		}

		try {
			const result = await updateUsername(session.user.id, newUsername)
			if (!result.message) {
				await updateSession({ name: newUsername })
				setNewUsername('')
				setStatus({
					success: true,
					message: '닉네임이 성공적으로 수정되었습니다.',
				})
			} else {
				setStatus({ success: false, message: result.message })
			}
		} catch (error) {
			console.error('닉네임 수정 에러:', error)
			setStatus({
				success: false,
				message: '닉네임 수정에 실패했습니다. 다시 시도해주세요.',
			})
		}
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<h2 className="text-2xl font-bold">닉네임 수정</h2>
			<div>
				<label htmlFor="newUsername" className="block mb-2">
					새 닉네임
				</label>
				<input
					type="text"
					id="newUsername"
					value={newUsername}
					onChange={(e) => setNewUsername(e.target.value)}
					className="w-full px-3 py-2 border rounded"
					required
				/>
			</div>
			<button
				type="submit"
				className="px-4 py-2 bg-blue-500 text-white rounded"
			>
				수정하기
			</button>
			{status.message && (
				<p className={`mt-2 text-${status.success ? 'green' : 'red'}-500`}>
					{status.message}
				</p>
			)}
		</form>
	)
}
