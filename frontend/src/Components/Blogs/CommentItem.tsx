'use client'

import React from 'react'
import { User, Trash2, Heart } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Comment } from '@/Interfaces/Blogs/Types/Blogs'

interface CommentItemProps {
	comment: Comment
	onDelete?: (commentId: string) => void
	canDelete?: boolean
	onLike?: (commentId: string) => void
	isLiking?: boolean
	user?: {
		id: string
		role?: {
			name: string
		}
	} | null
	onLoginRequired?: () => void
}

const CommentItem: React.FC<CommentItemProps> = ({
	comment,
	onDelete,
	canDelete = false,
	onLike,
	isLiking = false,
	user,
	onLoginRequired,
}) => {
	const handleDelete = () => {
		if (onDelete) {
			onDelete(comment.id)
		}
	}

	return (
		<div className='bg-gray-50 rounded-lg p-4 mb-4'>
			<div className='flex items-start space-x-3'>
				{/* User Avatar */}
				<div className='flex-shrink-0'>
					<div className='w-10 h-10 bg-gradient-to-br from-main to-secondary rounded-full flex items-center justify-center'>
						<User className='w-5 h-5 text-white' />
					</div>
				</div>

				{/* Comment Content */}
				<div className='flex-1 min-w-0'>
					<div className='flex items-center space-x-2 mb-2'>
						<span className='font-semibold text-gray-900'>
							{comment.accountName || 'Anonymous'}
						</span>
						<span className='text-gray-400'>•</span>
						<span className='text-sm text-gray-500'>
							{(() => {
								try {
									return formatDistanceToNow(new Date(comment.createdAt), {
										addSuffix: true,
										locale: vi,
									})
								} catch {
									return 'Invalid date'
								}
							})()}
						</span>
					</div>

					<p className='text-gray-700 mb-3'>{comment.content}</p>

					{/* Comment Actions */}
					<div className='flex items-center space-x-4'>
						{/* Like Button */}
						{onLike &&
							(user ? (
								<button
									onClick={() => onLike(comment.id)}
									disabled={isLiking}
									className='flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed'
									title={isLiking ? 'Đang thích...' : 'Like comment'}
								>
									<Heart
										className={`w-4 h-4 ${isLiking ? 'animate-pulse' : ''}`}
									/>
									<span className='text-sm'>{comment.like || 0}</span>
								</button>
							) : (
								<button
									onClick={onLoginRequired}
									className='flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors'
									title='Login to like comment'
								>
									<Heart className='w-4 h-4' />
									<span className='text-sm'>{comment.like || 0}</span>
								</button>
							))}

						{canDelete && (
							<button
								onClick={handleDelete}
								className='text-red-500 hover:text-red-700 transition-colors'
								title='Delete comment'
							>
								<Trash2 className='w-4 h-4' />
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

export default CommentItem
