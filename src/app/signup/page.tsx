'use client'

export default function SignUp() {
	const inputStyle =
		'block w-full rounded-md border border-gary-200 py-3 pl-5 text-sm outline-2 placeholder:text-gray-500'

	return (
		<main className="flex items-center justify-center md:h-screen">
			<div className="relative mx-auto flex w-full max-w-[400px] flex-col p-4 md:-mt-40">
				<div className="flex items-center h-6 p-6 bg-blue-600 text-white rounded-md ">
					회원가입
				</div>
				<form className="space-y-3">
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
									이름
								</label>
								<div className="relative">
									<input
										className={inputStyle}
										id="username"
										type="username"
										placeholder="이름을 입력하세요."
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
										placeholder="비밀번호를 입력하세요."
										required
									/>
								</div>
							</div>
							<div>
								<label
									className="block mt-5 mb-3 font-medium text-gray-900 text-xm"
									htmlFor="password"
								>
									비밀번호 확인
								</label>
								<div className="relative">
									<input
										className={inputStyle}
										id="password"
										type="password"
										placeholder="비밀번호를 한번 더 입력하세요."
										required
									/>
								</div>
							</div>
						</div>
						<button
							type="submit"
							className="w-full mt-8 bg-blue-300 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
						>
							회원가입
						</button>
					</div>
				</form>
			</div>
		</main>
	)
}
