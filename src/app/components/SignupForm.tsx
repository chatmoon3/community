'use client'

import { useState, useEffect } from 'react'
import { useFormState } from 'react-dom'
import { signUp } from '@/app/lib/user'

export default function SignUpForm() {
	const [state, formAction] = useFormState(signUp, { message: '' })
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [passwordError, setPasswordError] = useState('')

	useEffect(() => {
		if (password !== confirmPassword && confirmPassword !== '') {
			setPasswordError('비밀번호가 일치하지 않습니다.')
		} else {
			setPasswordError('')
		}
	}, [password, confirmPassword])

	const inputStyle =
		'block w-full rounded-md border border-gary-200 py-3 pl-5 text-sm outline-2 placeholder:text-gray-500'

	return (
		<main className="flex items-center justify-center min-h-[calc(100vh-90px)]">
			<div className="w-full max-w-[400px] flex-col">
				<div className="flex items-center h-6 p-6 text-white bg-blue-600 rounded-md ">
					회원가입
				</div>
				<form action={formAction} className="space-y-3">
					<div className="flex-1 px-6 pt-2 pb-4 rounded-lg bg-gray-50">
						<div className="w-full">
							<div>
								<label
									className="block mt-5 mb-3 font-normal text-gray-900 text-xm"
									htmlFor="email"
								>
									이메일
								</label>
								<div className="relative">
									<input
										className={inputStyle}
										id="email"
										name="email"
										type="email"
										placeholder="id@email.com"
										required
									/>
								</div>
							</div>
							<div>
								<label
									className="block mt-5 mb-3 font-medium text-gray-900 text-xm"
									htmlFor="name"
								>
									닉네임
								</label>
								<div className="relative">
									<input
										className={inputStyle}
										id="name"
										name="name"
										type="text"
										placeholder="홍길동"
										required
									/>
								</div>
							</div>
							<div>
								<label
									className="block mt-5 mb-3 font-medium text-gray-900 text-xm"
									htmlFor="password"
								>
									비밀번호
								</label>
								<div className="relative">
									<input
										className={inputStyle}
										id="password"
										name="password"
										type="password"
										placeholder="6자 이상 입력하세요."
										required
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										minLength={6}
									/>
								</div>
							</div>
							<div>
								<label
									className="block mt-5 mb-3 font-medium text-gray-900 text-xm"
									htmlFor="confirmPassword"
								>
									비밀번호 확인
								</label>
								<div className="relative">
									<input
										className={inputStyle}
										id="confirmPassword"
										name="confirmPassword"
										type="password"
										placeholder="비밀번호를 한번 더 입력하세요."
										required
										value={confirmPassword}
										onChange={(e) => setConfirmPassword(e.target.value)}
									/>
								</div>
							</div>
							{passwordError && (
								<p className="text-red-500 text-sm mt-1">{passwordError}</p>
							)}
						</div>
						<button
							type="submit"
							className="w-full mt-8 bg-blue-300 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
						>
							가입하기
						</button>
						{state.message && (
							<p className="text-sm mt-2 text-red-500">{state.message}</p>
						)}
					</div>
				</form>
			</div>
		</main>
	)
}
