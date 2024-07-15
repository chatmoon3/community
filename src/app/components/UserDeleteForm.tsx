'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { deleteUser } from '@/app/lib/user'

export default function UserDeleteForm() {
	const router = useRouter()
	const { data: session } = useSession()
	const [confirmDelete, setConfirmDelete] = useState<boolean>(false)
	const [error, setError] = useState<string | null>(null)

	const handleDeleteAccount = async () => {
		if (!confirmDelete) {
			setError('계정 삭제를 확인해주세요.')
			return
		}

		if (!session?.user?.id) {
			setError('사용자 정보를 찾을 수 없습니다.')
			return
		}

		const result = await deleteUser(session.user.id)
		if (!result.message) {
			await signOut({ redirect: false })
			router.push('/') // 성공 시 홈페이지로 리다이렉트
		} else {
			setError(result.message)
		}
	}

	return (
		<div>
			<h2 className="text-2xl font-bold mb-4">계정 삭제</h2>
			<p className="mb-4">
				계정을 삭제하면 모든 데이터가 영구적으로 제거됩니다. 이 작업은 되돌릴 수
				없습니다.
			</p>
			<div className="mb-4">
				<label className="flex items-center">
					<input
						type="checkbox"
						checked={confirmDelete}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setConfirmDelete(e.target.checked)
						}
						className="mr-2"
					/>
					<span>계정 삭제를 확인합니다.</span>
				</label>
			</div>
			<button
				onClick={handleDeleteAccount}
				disabled={!confirmDelete}
				className="bg-red-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
			>
				계정 삭제
			</button>
			{error && <p className="mt-4 text-red-500">{error}</p>}
		</div>
	)
}
