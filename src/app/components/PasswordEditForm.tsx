'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { updatePassword } from '@/app/lib/user'

export default function PasswordEditForm() {
	const { data: session } = useSession()
	const [currentPassword, setCurrentPassword] = useState('')
	const [newPassword, setNewPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [status, setStatus] = useState({ success: false, message: '' })

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setStatus({ success: false, message: '' })

		if (!session?.user?.id) {
			setStatus({ success: false, message: '사용자 정보를 찾을 수 없습니다.' })
			return
		}

		if (newPassword !== confirmPassword) {
			setStatus({ success: false, message: '새 비밀번호가 일치하지 않습니다.' })
			return
		}

		const result = await updatePassword(
			session.user.id,
			currentPassword,
			newPassword
		)
		if (!result.message) {
			setStatus({
				success: true,
				message: '비밀번호가 성공적으로 변경되었습니다.',
			})
			setCurrentPassword('')
			setNewPassword('')
			setConfirmPassword('')
		} else {
			setStatus({ success: false, message: result.message })
		}
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<h2 className="text-2xl font-bold">비밀번호 변경</h2>
			<div>
				<label htmlFor="currentPassword" className="block mb-2">
					현재 비밀번호
				</label>
				<input
					type="password"
					id="currentPassword"
					value={currentPassword}
					onChange={(e) => setCurrentPassword(e.target.value)}
					className="w-full px-3 py-2 border rounded"
					required
				/>
			</div>
			<div>
				<label htmlFor="newPassword" className="block mb-2">
					새 비밀번호
				</label>
				<input
					type="password"
					id="newPassword"
					value={newPassword}
					onChange={(e) => setNewPassword(e.target.value)}
					className="w-full px-3 py-2 border rounded"
					required
				/>
			</div>
			<div>
				<label htmlFor="confirmPassword" className="block mb-2">
					새 비밀번호 확인
				</label>
				<input
					type="password"
					id="confirmPassword"
					value={confirmPassword}
					onChange={(e) => setConfirmPassword(e.target.value)}
					className="w-full px-3 py-2 border rounded"
					required
				/>
			</div>
			<button
				type="submit"
				className="px-4 py-2 bg-blue-500 text-white rounded"
			>
				변경하기
			</button>
			{status.message && (
				<p className={`text-${status.success ? 'green' : 'red'}-500`}>
					{status.message}
				</p>
			)}
		</form>
	)
}
