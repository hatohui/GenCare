'use client'

import React, { useState } from 'react'
import { useCreateComment } from '@/Services/Blog-service'
import { useAccountStore } from '@/Hooks/useAccount'
import { Send, User } from 'lucide-react'

interface CommentFormProps {
	blogId: string
	onCommentAdded?: () => void
}

const CommentForm: React.FC<CommentFormProps> = ({
	blogId,
	onCommentAdded,
}) => {
	const [content, setContent] = useState('')
	const { data: user } = useAccountStore()
	const createComment = useCreateComment()

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (!content.trim() || !user) return

		createComment.mutate(
			{
				content: content.trim(),
				blogId,
			},
			{
				onSuccess: () => {
					setContent('')
					if (onCommentAdded) {
						onCommentAdded()
					}
				},
			}
		)
	}

	if (!user) {
		return (
			<div className='bg-gray-50 rounded-lg p-6 text-center'>
				<p className='text-gray-600 mb-4'>Bạn cần đăng nhập để bình luận</p>
			</div>
		)
	}

	return (
		<div className='bg-gray-50 rounded-lg p-6 mb-6'>
			<h3 className='font-semibold text-gray-900 mb-4 flex items-center gap-2'>
				<User className='w-5 h-5' />
				Thêm bình luận
			</h3>
			<form onSubmit={handleSubmit}>
				<div className='mb-4'>
					<textarea
						value={content}
						onChange={e => setContent(e.target.value)}
						placeholder='Chia sẻ suy nghĩ của bạn về bài viết này...'
						className='w-full p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-accent focus:border-transparent min-h-[100px]'
						disabled={createComment.isPending}
					/>
				</div>
				<div className='flex justify-between items-center'>
					<div className='text-sm text-gray-500'>
						Đăng nhập với tư cách: {user.firstName} {user.lastName}
					</div>
					<button
						type='submit'
						disabled={!content.trim() || createComment.isPending}
						className='px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent/80 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
					>
						<Send className='w-4 h-4' />
						{createComment.isPending ? 'Đang gửi...' : 'Gửi bình luận'}
					</button>
				</div>
			</form>
		</div>
	)
}

export default CommentForm
