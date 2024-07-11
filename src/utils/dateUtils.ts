import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'

export function customFormatDistanceToNow(date: Date) {
	const result = formatDistanceToNow(date, { addSuffix: true, locale: ko })
	if (
		result === '1분 미만 전' ||
		result === '1분 미만 후' ||
		result.endsWith('후')
	) {
		return '방금 전'
	}
	return result
}
