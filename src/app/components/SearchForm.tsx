'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'

interface SearchFormProps {
	isNavBar?: boolean
	className?: string
}

export default function SearchForm({
	isNavBar = false,
	className = '',
}: SearchFormProps) {
	const router = useRouter()
	const searchParams = useSearchParams()

	const [search, setSearch] = useState('')
	const [searchType, setSearchType] = useState('')
	const [isFocused, setIsFocused] = useState(false)

	useEffect(() => {
		setSearch(searchParams.get('keyword') || '')
		if (!isNavBar) {
			setSearchType(searchParams.get('type') || 'title')
		} else {
			setSearchType('title')
		}
	}, [searchParams, isNavBar])

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (!search) {
			alert('검색어를 입력해주세요')
			return
		}

		const params = new URLSearchParams()
		params.set('keyword', search)
		params.set('type', searchType)

		router.push(`/search?${params.toString()}`)
	}

	return (
		<form onSubmit={handleSubmit} className={`flex items-center ${className}`}>
			{!isNavBar && (
				<select
					value={searchType}
					onChange={(e) =>
						setSearchType(e.target.value as 'title' | 'content' | 'author')
					}
					className="h-10 px-2 py-2 border border-gray-300"
				>
					<option value="title">제목</option>
					<option value="content">내용</option>
					<option value="author">작성자</option>
				</select>
			)}
			<div className="relative flex-grow">
				<input
					type="text"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					onFocus={() => setIsFocused(true)}
					onBlur={() => setIsFocused(false)}
					placeholder="검색"
					className={`w-full h-10 px-4 py-2 pr-10 ${
						isFocused ? 'border-2 border-blue-600' : 'border border-gray-300'
					} focus:outline-none transition-colors duration-200`}
				/>
				<button
					type="submit"
					className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
				</button>
			</div>
		</form>
	)
}
