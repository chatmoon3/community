'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

export default function LoginForm() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [message, setMessage] = useState('')
	const router = useRouter()

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setMessage('')

		try {
			const response = await signIn('credentials', {
				email,
				password,
				redirect: false,
			})

			if (response?.error) {
				setMessage('로그인에 실패했습니다. 다시 시도해주세요.')
			} else {
				router.replace('/')
			}
		} catch (error) {
			console.error(error)
			setMessage('로그인에 실패했습니다. 다시 시도해주세요.')
		}
	}

	const inputStyle =
		'block w-full rounded-md border border-gary-200 py-3 pl-5 text-sm outline-2 placeholder:text-gray-500'

	return (
		<main className="flex items-center justify-center md:h-screen">
			<div className="relative mx-auto flex w-full max-w-[400px] flex-col p-4 md:-mt-40">
				<div className="flex items-center h-6 p-6 bg-blue-600 text-white rounded-md ">
					로그인
				</div>
				<form onSubmit={handleSubmit} className="space-y-3">
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
										type="email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										placeholder="이메일 주소를 입력하세요."
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
										type="password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										placeholder="비밀번호를 입력하세요."
										required
									/>
								</div>
							</div>
						</div>
						<button
							type="submit"
							className="w-full mt-8 bg-blue-300 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
						>
							로그인
						</button>
						{message && <p className="text-sm mt-2 text-red-500">{message}</p>}
					</div>
				</form>
			</div>
		</main>
	)
}
