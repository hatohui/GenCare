'use client'

import React from 'react'
import {
	useGetBlogById,
	useDeleteBlog,
	useGetComments,
	useDeleteComment,
	useLikeBlog,
	useLikeComment,
} from '@/Services/Blog-service'
import { Comment } from '@/Interfaces/Blogs/Types/Blogs'
import { use } from 'react'
import { useRouter } from 'next/navigation'
import FlorageBackground from '@/Components/Landing/FlorageBackground'
import ReactMarkdown from 'react-markdown'
import { CldImage } from 'next-cloudinary'
import {
	User,
	Clock,
	MessageCircle,
	Share2,
	Bookmark,
	ArrowLeft,
	Edit,
	Trash2,
	AlertCircle,
	CheckCircle,
	Heart,
} from 'lucide-react'
import { useAccountStore } from '@/Hooks/useAccount'
import CommentForm from '@/Components/Blogs/CommentForm'
import CommentItem from '@/Components/Blogs/CommentItem'

const BlogDetailPage = ({ params }: { params: Promise<{ id: string }> }) => {
	const router = useRouter()
	const { id } = use(params)
	const { data: blog, isLoading, error } = useGetBlogById(id)
	const deleteBlog = useDeleteBlog()
	const { data: user } = useAccountStore()
	const { data: comments = [] } = useGetComments(id)
	const deleteComment = useDeleteComment()
	const likeBlog = useLikeBlog()
	const likeComment = useLikeComment()

	// Debounce like actions to prevent spam
	const [isLikingBlog, setIsLikingBlog] = React.useState(false)
	const [isLikingComment, setIsLikingComment] = React.useState<string | null>(
		null
	)

	const handleLikeBlog = React.useCallback(() => {
		if (isLikingBlog) return
		setIsLikingBlog(true)
		likeBlog.mutate(id, {
			onSettled: () => {
				setTimeout(() => setIsLikingBlog(false), 1000) // 1 second cooldown
			},
		})
	}, [id, likeBlog, isLikingBlog])

	const handleLikeComment = React.useCallback(
		(commentId: string) => {
			if (isLikingComment === commentId) return
			setIsLikingComment(commentId)
			likeComment.mutate(commentId, {
				onSettled: () => {
					setTimeout(() => setIsLikingComment(null), 1000) // 1 second cooldown
				},
			})
		},
		[likeComment, isLikingComment]
	)

	// Check if user has permission to edit/delete (not member or consultant)
	const canManage = user && !['member', 'consultant'].includes(user.role?.name)

	const handleDelete = () => {
		if (confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
			deleteBlog.mutate(id, {
				onSuccess: () => {
					router.push('/blog')
				},
			})
		}
	}

	const handleCommentDelete = (commentId: string) => {
		if (confirm('Bạn có chắc chắn muốn xóa bình luận này?')) {
			deleteComment.mutate(commentId)
		}
	}

	const canDeleteComment = (comment: Comment) => {
		return !!(
			user &&
			(user.id === comment.accountId ||
				user.role?.name === 'admin' ||
				user.role?.name === 'manager')
		)
	}

	if (isLoading) {
		return (
			<div className='min-h-screen bg-gray-50 pt-20'>
				<div className='max-w-6xl mx-auto px-6 py-8'>
					<div className='flex gap-8'>
						{/* Sidebar */}
						<div className='w-80 flex-shrink-0'>
							<div className='bg-gradient-to-br from-general to-gray-50 rounded-xl p-6 sticky top-24'>
								<div className='animate-pulse'>
									<div className='h-4 bg-gray-200 rounded w-3/4 mb-4'></div>
									<div className='h-6 bg-gray-200 rounded w-full mb-2'></div>
									<div className='h-4 bg-gray-200 rounded w-2/3 mb-6'></div>
									<div className='h-4 bg-gray-200 rounded w-1/2'></div>
								</div>
							</div>
						</div>

						{/* Main Content */}
						<div className='flex-1'>
							<div className='bg-white rounded-xl shadow-sm border border-gray-200 p-8 animate-pulse'>
								<div className='h-8 bg-gray-200 rounded w-3/4 mb-4'></div>
								<div className='h-4 bg-gray-200 rounded w-1/4 mb-6'></div>
								<div className='h-4 bg-gray-200 rounded w-full mb-2'></div>
								<div className='h-4 bg-gray-200 rounded w-full mb-2'></div>
								<div className='h-4 bg-gray-200 rounded w-2/3'></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}

	if (error) {
		console.error('Blog fetch error:', error)
		return (
			<div className='min-h-screen bg-gray-50 pt-20'>
				<div className='max-w-6xl mx-auto px-6 py-8 text-center'>
					<div className='bg-white rounded-lg p-8'>
						<div className='text-6xl mb-4'>❌</div>
						<h2 className='text-2xl font-bold text-gray-900 mb-2'>
							Không thể tải bài viết
						</h2>
						<p className='text-gray-600 mb-4'>
							Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.
						</p>
						<div className='flex gap-4 justify-center'>
							<button
								onClick={() => window.location.reload()}
								className='px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent/80 transition-colors'
							>
								Thử lại
							</button>
							<button
								onClick={() => router.back()}
								className='px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors'
							>
								Quay lại
							</button>
						</div>
					</div>
				</div>
			</div>
		)
	}

	if (!blog) {
		return (
			<div className='min-h-screen bg-gray-50 pt-20'>
				<div className='max-w-6xl mx-auto px-6 py-8 text-center'>
					<div className='bg-white rounded-lg p-8'>
						<div className='text-6xl mb-4'>❌</div>
						<h2 className='text-2xl font-bold text-gray-900 mb-2'>
							Không tìm thấy bài viết
						</h2>
						<p className='text-gray-600 mb-4'>
							Bài viết này có thể đã bị xóa hoặc không tồn tại.
						</p>
						<button
							onClick={() => router.back()}
							className='px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent/80 transition-colors'
						>
							Quay lại
						</button>
					</div>
				</div>
			</div>
		)
	}

	return (
		<main className='relative min-h-screen bg-gray-50 text-gray-900 overflow-x-hidden pt-20'>
			<FlorageBackground />

			{/* Success/Error Messages for Delete */}
			{deleteBlog.isSuccess && (
				<div className='max-w-6xl mx-auto px-6 py-4'>
					<div className='bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3'>
						<CheckCircle className='w-5 h-5 text-green-600' />
						<div>
							<h3 className='font-semibold text-green-800'>
								Bài viết đã được xóa thành công!
							</h3>
							<p className='text-green-700 text-sm'>
								Bạn sẽ được chuyển hướng về diễn đàn trong giây lát...
							</p>
						</div>
					</div>
				</div>
			)}

			{deleteBlog.isError && (
				<div className='max-w-6xl mx-auto px-6 py-4'>
					<div className='bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3'>
						<AlertCircle className='w-5 h-5 text-red-600' />
						<div>
							<h3 className='font-semibold text-red-800'>
								Không thể xóa bài viết
							</h3>
							<p className='text-red-700 text-sm'>
								Đã xảy ra lỗi. Vui lòng thử lại sau.
							</p>
						</div>
					</div>
				</div>
			)}

			<div className='max-w-6xl mx-auto px-6 py-8'>
				<div className='flex gap-8'>
					{/* Sidebar */}
					<div className='w-80 flex-shrink-0'>
						<div className='bg-gradient-to-br from-general to-gray-50 rounded-xl p-6 sticky top-24'>
							{/* Author Info */}
							<div className='mb-6'>
								<h3 className='text-lg font-bold text-gray-800 mb-3 border-b-2 border-accent/30 pb-2'>
									Thông tin tác giả
								</h3>
								<div className='flex items-center space-x-3'>
									<div className='w-12 h-12 bg-gradient-to-br from-main to-secondary rounded-full flex items-center justify-center'>
										<User className='w-6 h-6 text-white' />
									</div>
									<div>
										<p className='font-semibold text-gray-900'>{blog.author}</p>
										<p className='text-xs text-gray-500'>
											{blog.publishedAt
												? new Date(blog.publishedAt).toLocaleDateString('vi-VN')
												: new Date(blog.createdAt).toLocaleDateString('vi-VN')}
										</p>
									</div>
								</div>
							</div>

							{/* Post Stats */}
							<div className='mb-6'>
								<h3 className='text-lg font-bold text-gray-800 mb-3 border-b-2 border-accent/30 pb-2'>
									Thống kê bài viết
								</h3>
								<div className='space-y-2'>
									<div className='flex items-center justify-between text-sm'>
										<span className='text-gray-600'>Lượt xem</span>
										<span className='font-medium'>0</span>
									</div>
									<div className='flex items-center justify-between text-sm'>
										<span className='text-gray-600'>Bình luận</span>
										<span className='font-medium'>0</span>
									</div>
									<div className='flex items-center justify-between text-sm'>
										<span className='text-gray-600'>Lượt thích</span>
										<span className='font-medium'>0</span>
									</div>
								</div>
							</div>

							{/* Tags */}
							<div className='mb-6'>
								<h3 className='text-lg font-bold text-gray-800 mb-3 border-b-2 border-accent/30 pb-2'>
									Thẻ bài viết
								</h3>
								<div className='flex flex-wrap gap-2'>
									{blog.tagTitle?.map((tag: string) => (
										<span
											key={tag}
											className='px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-medium'
										>
											{tag}
										</span>
									))}
								</div>
							</div>

							{/* Share Options */}
							<div className='mb-6'>
								<h3 className='text-lg font-bold text-gray-800 mb-3 border-b-2 border-accent/30 pb-2'>
									Chia sẻ
								</h3>
								<div className='space-y-2'>
									<button className='w-full flex items-center gap-2 p-2 text-sm text-gray-600 hover:bg-accent/10 rounded-lg transition-colors'>
										<Share2 className='w-4 h-4' />
										Chia sẻ bài viết
									</button>
									<button className='w-full flex items-center gap-2 p-2 text-sm text-gray-600 hover:bg-accent/10 rounded-lg transition-colors'>
										<Bookmark className='w-4 h-4' />
										Lưu bài viết
									</button>
								</div>
							</div>

							{/* Back to Forum */}
							<button
								onClick={() => router.push('/blog')}
								className='w-full flex items-center gap-2 p-3 bg-accent text-white rounded-lg hover:bg-accent/80 transition-colors'
							>
								<ArrowLeft className='w-4 h-4' />
								Quay lại diễn đàn
							</button>

							{/* Edit/Delete Buttons for Admin/Staff/Manager */}
							{canManage && (
								<div className='mt-4 space-y-2'>
									<button
										onClick={() => router.push(`/blog/${id}/edit`)}
										className='w-full flex items-center gap-2 p-3 bg-main text-white rounded-lg hover:bg-main/80 transition-colors'
									>
										<Edit className='w-4 h-4' />
										Chỉnh sửa bài viết
									</button>
									<button
										onClick={handleDelete}
										disabled={deleteBlog.isPending}
										className='w-full flex items-center gap-2 p-3 bg-accent text-white rounded-lg hover:bg-accent/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
									>
										<Trash2 className='w-4 h-4' />
										{deleteBlog.isPending ? 'Đang xóa...' : 'Xóa bài viết'}
									</button>
								</div>
							)}
						</div>
					</div>

					{/* Main Content */}
					<div className='flex-1'>
						{/* Blog Post */}
						<article className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8'>
							{/* Blog Images */}
							{blog.imageUrls && blog.imageUrls.length > 0 && (
								<div className='relative h-64 md:h-80 bg-gradient-to-br from-main to-secondary'>
									<CldImage
										src={blog.imageUrls[0]}
										alt={blog.title}
										className='object-cover w-full h-full'
									/>
								</div>
							)}

							{/* Blog Content */}
							<div className='p-8'>
								{/* Header */}
								<div className='mb-6'>
									<div className='flex items-center space-x-2 mb-3'>
										{blog.tagTitle?.map((tag: string) => (
											<span
												key={tag}
												className='px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-medium'
											>
												{tag}
											</span>
										))}
									</div>

									<h1 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight'>
										{blog.title}
									</h1>

									{/* Author and Meta Info */}
									<div className='flex items-center justify-between flex-wrap gap-4'>
										<div className='flex items-center space-x-4'>
											<div className='flex items-center space-x-3'>
												<div className='w-12 h-12 bg-gradient-to-br from-main to-secondary rounded-full flex items-center justify-center'>
													<User className='w-6 h-6 text-white' />
												</div>
												<div>
													<p className='font-semibold text-gray-900'>
														{blog.author}
													</p>
													<div className='flex items-center text-gray-500 text-sm'>
														<Clock className='w-4 h-4 mr-1' />
														{blog.publishedAt
															? new Date(blog.publishedAt).toLocaleDateString(
																	'vi-VN',
																	{
																		year: 'numeric',
																		month: 'long',
																		day: 'numeric',
																	}
															  )
															: new Date(blog.createdAt).toLocaleDateString(
																	'vi-VN',
																	{
																		year: 'numeric',
																		month: 'long',
																		day: 'numeric',
																	}
															  )}
													</div>
												</div>
											</div>
										</div>

										{/* Action Buttons */}
										<div className='flex items-center space-x-2'>
											<button className='p-2 text-gray-500 hover:text-accent hover:bg-gray-100 rounded-lg transition-colors'>
												<Bookmark className='w-5 h-5' />
											</button>
											<button className='p-2 text-gray-500 hover:text-accent hover:bg-gray-100 rounded-lg transition-colors'>
												<Share2 className='w-5 h-5' />
											</button>
										</div>
									</div>
								</div>

								{/* Blog Content */}
								<div className='prose prose-lg max-w-none text-gray-700 leading-relaxed'>
									<ReactMarkdown>{blog.content}</ReactMarkdown>
								</div>

								{/* Additional Images */}
								{blog.imageUrls && blog.imageUrls.length > 1 && (
									<div className='mt-8 grid grid-cols-1 md:grid-cols-2 gap-4'>
										{blog.imageUrls.slice(1).map((url: string, idx: number) => (
											<CldImage
												key={idx}
												src={url}
												alt={`Blog image ${idx + 2}`}
												className='rounded-lg shadow-sm w-full object-cover'
											/>
										))}
									</div>
								)}

								{/* Like Section */}
								<div className='mt-8 pt-6 border-t border-gray-200'>
									<div className='flex items-center justify-between'>
										<div className='flex items-center space-x-4'>
											{user ? (
												<button
													onClick={handleLikeBlog}
													disabled={likeBlog.isPending || isLikingBlog}
													className='flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed'
												>
													<Heart
														className={`w-5 h-5 ${
															likeBlog.isPending || isLikingBlog
																? 'animate-pulse'
																: ''
														}`}
													/>
													<span className='font-medium'>
														{likeBlog.isPending || isLikingBlog
															? 'Đang thích...'
															: 'Thích'}
													</span>
												</button>
											) : (
												<button
													onClick={() => router.push('/login')}
													className='flex items-center space-x-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-full hover:bg-gray-100 transition-colors'
												>
													<Heart className='w-5 h-5' />
													<span className='font-medium'>
														Đăng nhập để thích
													</span>
												</button>
											)}
											<span className='text-gray-600 font-medium'>
												{blog.like || 0} lượt thích
											</span>
										</div>
									</div>
								</div>
							</div>
						</article>

						{/* Discussion Section */}
						<section className='bg-white rounded-xl shadow-sm border border-gray-200 p-8'>
							<div className='flex items-center justify-between mb-6'>
								<h2 className='text-2xl font-bold text-gray-900 flex items-center'>
									<MessageCircle className='w-6 h-6 mr-2 text-accent' />
									Thảo luận
								</h2>
								<div className='text-sm text-gray-500'>
									{comments.length} bình luận
								</div>
							</div>

							{/* Comment Form */}
							<CommentForm blogId={id} />

							{/* Comments List */}
							{comments.length > 0 ? (
								<div className='space-y-4'>
									{comments
										.filter((comment: Comment) => !comment.isDeleted)
										.map((comment: Comment) => (
											<CommentItem
												key={comment.id}
												comment={comment}
												onDelete={handleCommentDelete}
												canDelete={canDeleteComment(comment)}
												onLike={handleLikeComment}
												isLiking={
													likeComment.isPending ||
													isLikingComment === comment.id
												}
												user={user}
												onLoginRequired={() => router.push('/login')}
											/>
										))}
								</div>
							) : (
								<div className='text-center py-8 text-gray-500'>
									<div className='text-4xl mb-4'>💬</div>
									<h3 className='text-lg font-semibold mb-2'>
										Chưa có bình luận nào
									</h3>
									<p>Hãy là người đầu tiên chia sẻ suy nghĩ của bạn!</p>
								</div>
							)}
						</section>

						{/* Related Posts */}
						<section className='bg-white rounded-xl shadow-sm border border-gray-200 p-8 mt-8'>
							<h2 className='text-2xl font-bold text-gray-900 mb-6'>
								Bài viết liên quan
							</h2>
							<div className='text-center py-8 text-gray-500'>
								<div className='text-4xl mb-4'>📚</div>
								<h3 className='text-lg font-semibold mb-2'>
									Chưa có bài viết liên quan
								</h3>
								<p>Khám phá thêm các bài viết khác trong diễn đàn!</p>
							</div>
						</section>
					</div>
				</div>
			</div>
		</main>
	)
}

export default BlogDetailPage
