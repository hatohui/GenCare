'use client'

import FlorageBackground from '@/Components/Landing/FlorageBackground'
import SearchBar from '@/Components/Management/SearchBar'
import TypedText from '@/Components/TypedText'
import { useAccountStore } from '@/Hooks/useAccount'
import { useLocale } from '@/Hooks/useLocale'
import { Blog } from '@/Interfaces/Blogs/Types/Blogs'
import {
	useDeleteBlog,
	useInfiniteBlogs,
	useLikeBlog,
} from '@/Services/Blog-service'
import {
	Clock,
	Edit,
	Heart,
	Loader2,
	MessageCircle,
	Plus,
	Trash2,
	User,
	X,
} from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'
import { useInView } from 'react-intersection-observer'

// Tag suggestions (reuse from BlogForm)
const TAG_SUGGESTIONS = [
	'health',
	'wellness',
	'nutrition',
	'fitness',
	'mental health',
	'exercise',
	'diet',
	'lifestyle',
	'self-care',
	'motivation',
	'productivity',
	'mindfulness',
	'stress',
	'happiness',
	'sleep',
	'workout',
	'yoga',
	'meditation',
	'recipes',
	'tips',
	'advice',
]

const ITEMS_PER_PAGE = 10

// Forum-style blog item component
const ForumBlogItem = React.memo(({ blog }: { blog: Blog }) => {
	const router = useRouter()
	const { data: user } = useAccountStore()
	const { t } = useLocale()
	const deleteBlog = useDeleteBlog()
	const likeBlog = useLikeBlog()

	// Check if user has permission to edit/delete (not member or consultant)
	const canManage = user && !['member', 'consultant'].includes(user.role?.name)

	const handleDelete = (e: React.MouseEvent) => {
		e.stopPropagation() // Prevent navigation to blog detail
		if (confirm(t('blog.confirm_delete'))) {
			deleteBlog.mutate(blog.id, {
				onSuccess: () => {
					// Query invalidation will handle the update automatically
					// No need for window.location.reload()
				},
				onError: error => {
					console.error(t('blog.delete_failed'), error)
					// Could add toast notification here
				},
			})
		}
	}

	const handleEdit = (e: React.MouseEvent) => {
		e.stopPropagation() // Prevent navigation to blog detail
		router.push(`/blog/${blog.id}/edit`)
	}

	return (
		<div
			className='bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer relative'
			onClick={() => router.push(`/blog/${blog.id}`)}
		>
			<div className='flex items-start space-x-4'>
				{/* Author Avatar */}
				<div className='flex-shrink-0'>
					<div className='w-12 h-12 bg-gradient-to-br from-main to-secondary rounded-full flex items-center justify-center'>
						<User className='w-6 h-6 text-white' />
					</div>
				</div>

				{/* Content */}
				<div className='flex-1 min-w-0'>
					<div className='flex items-center space-x-2 mb-2'>
						<span className='font-semibold text-main'>{blog.author}</span>
						<span className='text-gray-400'>•</span>
						<div className='flex items-center text-gray-500 text-sm'>
							<Clock className='w-4 h-4 mr-1' />
							{blog.publishedAt
								? new Date(blog.publishedAt).toLocaleDateString()
								: new Date(blog.createdAt).toLocaleDateString()}
						</div>
					</div>

					<h3 className='text-lg font-bold text-gray-900 mb-2 hover:text-accent transition-colors'>
						{blog.title}
					</h3>

					<p className='text-gray-600 text-sm mb-3 line-clamp-2'>
						{blog.content?.replace(/[#*`]/g, '').slice(0, 150)}...
					</p>

					{/* Tags */}
					<div className='flex flex-wrap gap-2 mb-3'>
						{blog.tagTitle?.map((tag: string) => (
							<span
								key={tag}
								className='px-2 py-1 bg-accent/10 text-accent rounded-full text-xs font-medium'
							>
								{tag}
							</span>
						))}
					</div>

					{/* Forum stats */}
					<div className='flex items-center space-x-4 text-gray-500 text-sm'>
						<div className='flex items-center'>
							<MessageCircle className='w-4 h-4 mr-1' />
							<span>
								{blog.comments || 0} {t('blog.comments')}
							</span>
						</div>
						{user ? (
							<button
								onClick={e => {
									e.stopPropagation() // Prevent navigation to blog detail
									likeBlog.mutate(blog.id)
								}}
								disabled={likeBlog.isPending}
								className='flex items-center hover:text-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
							>
								<Heart className='w-4 h-4 mr-1' />
								<span>
									{blog.likes || 0} {t('blog.likes')}
								</span>
							</button>
						) : (
							<button
								onClick={e => {
									e.stopPropagation() // Prevent navigation to blog detail
									router.push('/login')
								}}
								className='flex items-center hover:text-red-500 transition-colors'
							>
								<Heart className='w-4 h-4 mr-1' />
								<span>
									{blog.likes || 0} {t('blog.likes')}
								</span>
							</button>
						)}
					</div>
				</div>
			</div>

			{/* Edit/Delete Buttons for Admin/Staff/Manager */}
			{canManage && (
				<div className='absolute top-4 right-4 flex gap-2'>
					<button
						onClick={handleEdit}
						className='p-2 bg-main text-white rounded-lg hover:bg-main/80 transition-colors'
						title={t('blog.edit_post')}
					>
						<Edit className='w-4 h-4' />
					</button>
					<button
						onClick={handleDelete}
						disabled={deleteBlog.isPending}
						className='p-2 bg-accent text-white rounded-lg hover:bg-accent/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
						title={t('blog.delete_post')}
					>
						<Trash2 className='w-4 h-4' />
					</button>
				</div>
			)}
		</div>
	)
})

ForumBlogItem.displayName = 'ForumBlogItem'

const BlogPage = () => {
	const router = useRouter()
	const searchParams = useSearchParams()
	const { data: user } = useAccountStore()
	const { t, locale } = useLocale()

	// Always derive filters from URL
	const search = searchParams?.get('search') || ''
	const selectedTag = searchParams?.get('tag') || null

	// Memoize the strings to prevent unnecessary re-renders of TypedText
	const titleStrings = React.useMemo(() => [t('blog.forum_title')], [t])
	const subtitleStrings = React.useMemo(() => [t('blog.forum_subtitle')], [t])

	// Infinite scroll setup
	const { ref, inView } = useInView()

	// Fetch blogs with infinite scrolling
	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		isError,
	} = useInfiniteBlogs(ITEMS_PER_PAGE, search, selectedTag)

	// Flatten all pages into a single array
	const blogs = data?.pages.flatMap(page => page) || []

	// Load more when the last item comes into view
	React.useEffect(() => {
		if (inView && hasNextPage && !isFetchingNextPage) {
			fetchNextPage()
		}
	}, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

	// Handlers
	const handleTagClick = (tag: string | null) => {
		const params = new URLSearchParams(searchParams?.toString())
		if (tag) {
			params.set('tag', tag)
		} else {
			params.delete('tag')
		}
		// Remove page parameter for infinite scroll
		params.delete('page')
		router.push(`/blog?${params.toString()}`)
	}

	// Authorization: consultant, staff, manager, admin
	const canCreateBlog =
		user &&
		['consultant', 'staff', 'manager', 'admin'].includes(user.role?.name)

	return (
		<main className='min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20'>
			{/* Floating Create Blog Button */}
			{canCreateBlog && (
				<button
					onClick={() => router.push('/blog/create')}
					className='fixed bottom-8 right-8 z-50 flex items-center justify-center w-16 h-16 rounded-full bg-accent text-white shadow-lg hover:bg-blue-700 focus:ring-4 focus:ring-accent/30 transition text-2xl group'
					title={t('blog.create_post')}
					aria-label={t('blog.create_post')}
				>
					<Plus className='w-8 h-8' />
					<span className='sr-only'>{t('blog.create_post')}</span>
					<span className='absolute bottom-20 right-0 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition pointer-events-none'>
						{t('blog.create_post')}
					</span>
				</button>
			)}

			{/* Hero Section */}
			<section className='py-16 bg-gradient-to-r from-main to-secondary text-white relative overflow-hidden'>
				<div className='absolute inset-0 florageBackground' />
				<div className='max-w-6xl mx-auto px-6 text-center relative z-10 backdrop-blur-sm'>
					<h3 className='font-semibold mb-4 text-white text-shadow-2xs'>
						<span>{t('blog.knowledge_forum')}</span>
					</h3>
					<h1 className='text-5xl font-bold mb-6 text-shadow-2xs'>
						<TypedText
							key='blog-title'
							typeSpeed={12}
							className='bg-gradient-to-r from-white to-general bg-clip-text text-transparent'
							strings={titleStrings}
						/>
					</h1>
					<p className='text-xl mb-8 max-w-3xl mx-auto text-shadow-2xs'>
						<TypedText
							key='blog-subtitle'
							typeSpeed={8}
							className='bg-gradient-to-r bg-white bg-clip-text text-transparent'
							strings={subtitleStrings}
						/>
					</p>
				</div>
				<FlorageBackground />
			</section>

			{/* Top Bar with Recommended */}
			<section className='py-4 bg-white border-b border-gray-200'>
				<div className='max-w-6xl mx-auto px-6'>
					<div className='flex items-center justify-between'>
						<button className='px-6 py-2 bg-gradient-to-r from-main to-secondary text-white rounded-full font-medium hover:shadow-lg transition-shadow'>
							{t('blog.recommended')}
						</button>
						<div className='text-sm text-gray-500'>
							{isLoading
								? t('common.loading')
								: t('blog.count_posts', { count: blogs.length })}
						</div>
					</div>
				</div>
			</section>

			{/* Main Content with Sidebar */}
			<div className='max-w-6xl mx-auto px-6 py-8'>
				<div className='flex gap-8'>
					{/* Sidebar */}
					<div className='w-80 flex-shrink-0'>
						<div className='bg-gradient-to-br from-general to-gray-50 rounded-xl p-6 sticky top-24'>
							{/* Search Bar */}
							<div className='mb-6'>
								<div className='[&_.search-input]:border-2 [&_.search-input]:border-dashed [&_.search-input]:border-accent/30 [&_.search-input]:focus:ring-2 [&_.search-input]:focus:ring-accent [&_.search-input]:focus:border-transparent [&_.search-input]:bg-white [&_.search-input]:rounded-lg [&_.search-input]:px-4 [&_.search-input]:py-3 [&_.search-input]:pl-10 [&_.search-input]:placeholder:text-gray-500 [&_.search-icon]:text-accent'>
									<SearchBar className='w-full' />
								</div>
							</div>

							{/* Recent Posts */}
							<div className='mb-6'>
								<h3 className='text-lg font-bold text-gray-800 mb-3 border-b-2 border-accent/30 pb-2'>
									{t('blog.recent_posts')}
								</h3>
								<div className='space-y-2'>
									{blogs.slice(0, 3).map((blog: Blog) => (
										<div
											key={blog.id}
											className='p-3 bg-white rounded-lg cursor-pointer hover:bg-accent/5 transition-colors'
											onClick={() => router.push(`/blog/${blog.id}`)}
										>
											<h4 className='font-medium text-gray-800 text-sm line-clamp-2'>
												{blog.title}
											</h4>
											<p className='text-xs text-gray-500 mt-1'>
												{blog.publishedAt
													? new Date(blog.publishedAt).toLocaleDateString()
													: new Date(blog.createdAt).toLocaleDateString()}
											</p>
										</div>
									))}
								</div>
							</div>

							{/* Categories */}
							<div className='mb-6'>
								<h3 className='text-lg font-bold text-gray-800 mb-3 border-b-2 border-accent/30 pb-2'>
									{t('blog.categories')}
								</h3>
								<div className='space-y-2'>
									{[
										t('blog.category_health'),
										t('blog.category_lifestyle'),
										t('blog.category_medical'),
										t('blog.category_nutrition'),
										t('blog.category_psychology'),
									].map(category => (
										<button
											key={category}
											className='w-full text-left p-2 text-sm text-gray-600 hover:bg-accent/10 rounded-lg transition-colors'
										>
											{category}
										</button>
									))}
								</div>
							</div>

							{/* Tags */}
							<div className='mb-6'>
								<div className='flex items-center justify-between mb-3'>
									<h3 className='text-lg font-bold text-gray-800 border-b-2 border-accent/30 pb-2'>
										{t('blog.tags')}
									</h3>
									{selectedTag && (
										<button
											onClick={() => handleTagClick(null)}
											className='flex items-center gap-1 text-xs text-gray-500 hover:text-accent transition-colors'
											title={t('blog.clear_tag_filter')}
										>
											<X className='w-3 h-3' />
											{t('blog.clear')}
										</button>
									)}
								</div>
								<p className='text-xs text-gray-500 mb-3'>
									{t('blog.tags_feature_in_progress')}
								</p>
								<div className='flex flex-wrap gap-2'>
									{TAG_SUGGESTIONS.slice(0, 8).map(tag => (
										<button
											key={tag}
											onClick={() => handleTagClick(tag)}
											className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
												selectedTag === tag
													? 'bg-accent text-white'
													: 'bg-white text-gray-600 hover:bg-accent/10'
											}`}
										>
											{tag}
										</button>
									))}
								</div>
							</div>
						</div>
					</div>

					{/* Main Content */}
					<div className='flex-1'>
						{/* Forum Threads List */}
						<div className='space-y-4'>
							{/* Error State */}
							{isError && (
								<div className='text-center py-12 text-red-500'>
									<div className='text-6xl mb-4'>❌</div>
									<h3 className='text-xl font-semibold mb-2'>
										{t('blog.load_failed')}
									</h3>
									<p className='mb-4'>{t('blog.load_failed_desc')}</p>
									<button
										onClick={() => window.location.reload()}
										className='px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/80 transition-colors'
									>
										{t('common.try_again')}
									</button>
								</div>
							)}

							{/* Empty State */}
							{blogs.length === 0 && !isLoading && !isError && (
								<div className='text-center py-12 text-gray-500'>
									<div className='text-6xl mb-4'>📝</div>
									<h3 className='text-xl font-semibold mb-2'>
										{t('blog.no_posts')}
									</h3>
									<p>{t('blog.be_first_to_share')}</p>
								</div>
							)}

							{isLoading && (
								<div className='space-y-4'>
									{[...Array(3)].map((_, i) => (
										<div
											key={i}
											className='bg-white border border-gray-200 rounded-lg p-6 animate-pulse'
										>
											<div className='flex items-start space-x-4'>
												<div className='w-12 h-12 bg-gray-200 rounded-full'></div>
												<div className='flex-1'>
													<div className='h-4 bg-gray-200 rounded w-1/4 mb-2'></div>
													<div className='h-6 bg-gray-200 rounded w-3/4 mb-2'></div>
													<div className='h-4 bg-gray-200 rounded w-full mb-2'></div>
													<div className='h-4 bg-gray-200 rounded w-2/3'></div>
												</div>
											</div>
										</div>
									))}
								</div>
							)}

							{blogs.map((blog: Blog) => (
								<ForumBlogItem key={blog.id} blog={blog} />
							))}

							{/* Infinite Scroll Loading Indicator */}
							{hasNextPage && (
								<div ref={ref} className='flex justify-center py-8'>
									{isFetchingNextPage ? (
										<div className='flex items-center gap-2 text-gray-500'>
											<Loader2 className='w-5 h-5 animate-spin' />
											<span>{t('blog.loading_more')}</span>
										</div>
									) : (
										<div className='text-gray-400 text-sm'>
											{t('blog.scroll_to_load_more')}
										</div>
									)}
								</div>
							)}

							{/* End of content indicator */}
							{!hasNextPage && blogs.length > 0 && (
								<div className='text-center py-8 text-gray-400'>
									<div className='text-2xl mb-2'>🎉</div>
									<p className='text-sm'>{t('blog.all_posts_loaded')}</p>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</main>
	)
}

export default BlogPage
