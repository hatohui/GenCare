'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import {
	Pencil,
	HelpCircle,
	Tag,
	FileText,
	Save,
	X,
	Info,
	Bold,
	Italic,
	Heading1,
	Heading2,
	List,
	Link,
	Image as ImageIcon,
} from 'lucide-react'
import FloatingLabelInput from '../Form/FloatingLabel'
import ReactMarkdown from 'react-markdown'
import { CloudinaryButton } from '../CloudinaryButton'
import { motion, AnimatePresence } from 'motion/react'
import './BlogForm.css'
import Image from 'next/image'

// Enhanced editable preview component
const EditablePreview = ({
	value,
	onChange,
	placeholder,
}: {
	value: string
	onChange: (value: string) => void
	placeholder: string
}) => {
	const [isEditing, setIsEditing] = useState(false)
	const [editValue, setEditValue] = useState(value)
	const textareaRef = React.useRef<HTMLTextAreaElement>(null)

	// Sync edit value with parent value
	React.useEffect(() => {
		setEditValue(value)
	}, [value])

	const insertMarkdown = (before: string, after: string = '') => {
		if (!textareaRef.current) return

		const textarea = textareaRef.current
		const start = textarea.selectionStart
		const end = textarea.selectionEnd
		const text = editValue

		const beforeText = text.substring(0, start)
		const selectedText = text.substring(start, end)
		const afterText = text.substring(end)

		const newText = beforeText + before + selectedText + after + afterText
		setEditValue(newText)
		onChange(newText)

		// Set cursor position
		setTimeout(() => {
			if (textareaRef.current) {
				const newCursorPos = start + before.length
				textareaRef.current.setSelectionRange(
					newCursorPos,
					newCursorPos + selectedText.length
				)
				textareaRef.current.focus()
			}
		}, 0)
	}

	const handleEditSave = () => {
		onChange(editValue)
		setIsEditing(false)
	}

	const handleEditCancel = () => {
		setEditValue(value)
		setIsEditing(false)
	}

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Escape') {
			handleEditCancel()
		} else if (e.key === 'Enter' && e.ctrlKey) {
			handleEditSave()
		}
	}

	return (
		<div className='space-y-2'>
			{/* Toolbar */}
			<div className='flex items-center justify-between p-2 bg-gray-50 border-b border-gray-200'>
				<div className='flex flex-wrap gap-1'>
					<button
						type='button'
						onClick={() => insertMarkdown('**', '**')}
						className='p-1 text-gray-600 hover:text-accent hover:bg-gray-100 rounded'
						title='Bold (Ctrl+B)'
					>
						<Bold className='w-4 h-4' />
					</button>
					<button
						type='button'
						onClick={() => insertMarkdown('*', '*')}
						className='p-1 text-gray-600 hover:text-accent hover:bg-gray-100 rounded'
						title='Italic (Ctrl+I)'
					>
						<Italic className='w-4 h-4' />
					</button>
					<button
						type='button'
						onClick={() => insertMarkdown('# ')}
						className='p-1 text-gray-600 hover:text-accent hover:bg-gray-100 rounded'
						title='Heading 1'
					>
						<Heading1 className='w-4 h-4' />
					</button>
					<button
						type='button'
						onClick={() => insertMarkdown('## ')}
						className='p-1 text-gray-600 hover:text-accent hover:bg-gray-100 rounded'
						title='Heading 2'
					>
						<Heading2 className='w-4 h-4' />
					</button>
					<button
						type='button'
						onClick={() => insertMarkdown('- ')}
						className='p-1 text-gray-600 hover:text-accent hover:bg-gray-100 rounded'
						title='List'
					>
						<List className='w-4 h-4' />
					</button>
					<button
						type='button'
						onClick={() => insertMarkdown('[', '](url)')}
						className='p-1 text-gray-600 hover:text-accent hover:bg-gray-100 rounded'
						title='Link'
					>
						<Link className='w-4 h-4' />
					</button>
					<button
						type='button'
						onClick={() => insertMarkdown('![alt](', ')')}
						className='p-1 text-gray-600 hover:text-accent hover:bg-gray-100 rounded'
						title='Image'
					>
						<ImageIcon className='w-4 h-4' />
					</button>
				</div>

				<div className='flex items-center gap-2'>
					{isEditing ? (
						<>
							<button
								type='button'
								onClick={handleEditSave}
								className='px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600'
							>
								Save
							</button>
							<button
								type='button'
								onClick={handleEditCancel}
								className='px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600'
							>
								Cancel
							</button>
						</>
					) : (
						<button
							type='button'
							onClick={() => setIsEditing(true)}
							className='px-2 py-1 text-xs bg-accent text-white rounded hover:bg-blue-600'
						>
							Edit
						</button>
					)}
				</div>
			</div>

			{/* Content Area */}
			<div className='min-h-[400px] border border-gray-200 rounded-lg overflow-hidden'>
				{isEditing ? (
					<textarea
						ref={textareaRef}
						value={editValue}
						onChange={e => setEditValue(e.target.value)}
						onKeyDown={handleKeyDown}
						placeholder={placeholder}
						className='w-full h-full min-h-[400px] p-4 border-none focus:ring-0 resize-none font-mono text-sm'
						style={{ fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace' }}
					/>
				) : (
					<div className='prose prose-lg max-w-none p-4 min-h-[400px] overflow-auto'>
						{value ? (
							<ReactMarkdown>{value}</ReactMarkdown>
						) : (
							<div className='text-center text-gray-500 py-20'>
								<FileText className='w-12 h-12 mx-auto mb-4 text-gray-300' />
								<p className='text-lg font-medium'>Chưa có nội dung</p>
								<p className='text-sm'>Nhấp Edit để bắt đầu viết bài viết</p>
								<p className='text-xs text-gray-400 mt-2'>
									Sử dụng thanh công cụ phía trên để định dạng
								</p>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	)
}

export type BlogCreateInput = {
	title: string
	content: string
	author: string
	tagTitles?: string[]
	imageUrls?: string[]
}

interface BlogFormProps {
	onSubmit: (data: BlogCreateInput) => void
	loading?: boolean
	imageUrls?: string[]
	onImageUrlsChange?: (urls: string[]) => void
	initialData?: Partial<BlogCreateInput>
}

// Enhanced tag suggestions with categories
const TAG_SUGGESTIONS = {
	health: [
		'health',
		'wellness',
		'nutrition',
		'fitness',
		'mental health',
		'exercise',
		'diet',
	],
	lifestyle: [
		'lifestyle',
		'self-care',
		'motivation',
		'productivity',
		'mindfulness',
		'stress',
		'happiness',
	],
	activities: [
		'sleep',
		'workout',
		'yoga',
		'meditation',
		'recipes',
		'tips',
		'advice',
	],
	medical: [
		'prevention',
		'treatment',
		'symptoms',
		'diagnosis',
		'recovery',
		'therapy',
	],
}

export const BlogForm: React.FC<BlogFormProps> = ({
	onSubmit,
	loading,
	imageUrls = [],
	onImageUrlsChange,
	initialData,
}) => {
	const [showMarkdownHelp, setShowMarkdownHelp] = useState(false)
	const [tagInputValue, setTagInputValue] = useState('')
	const [showTagSuggestions, setShowTagSuggestions] = useState(false)
	const [selectedCategory, setSelectedCategory] = useState<string>('all')
	const tagInputRef = React.useRef<HTMLInputElement>(null)

	const {
		handleSubmit,
		setValue,
		formState: { errors },
		watch,
	} = useForm<BlogCreateInput>({
		defaultValues: {
			title: initialData?.title || '',
			content: initialData?.content || '',
			author: initialData?.author || '',
			tagTitles: initialData?.tagTitles || [],
			imageUrls: initialData?.imageUrls || [],
		},
		mode: 'onChange',
	})

	const watchedContent = watch('content')
	const watchedTitle = watch('title')
	const watchedAuthor = watch('author')
	const watchedTags = watch('tagTitles') || []

	// Debug logging
	React.useEffect(() => {
		console.log('BlogForm - Initial Data:', initialData)
		console.log('BlogForm - Watched Tags:', watchedTags)
	}, [initialData, watchedTags])

	// Get all tag suggestions
	const allTags = Object.values(TAG_SUGGESTIONS).flat()

	// Filter suggestions based on input, category, and exclude already selected tags
	const filteredSuggestions = allTags.filter(tag => {
		const tagLower = tag.toLowerCase()
		const inputLower = tagInputValue.toLowerCase()
		const matchesInput = tagLower.includes(inputLower)
		const notSelected = !watchedTags.some(
			existingTag => existingTag.toLowerCase() === tagLower
		)

		if (selectedCategory === 'all') {
			return matchesInput && notSelected
		}

		const categoryTags =
			TAG_SUGGESTIONS[selectedCategory as keyof typeof TAG_SUGGESTIONS] || []
		return matchesInput && notSelected && categoryTags.includes(tag)
	})

	// Handle tag input
	const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTagInputValue(e.target.value)
		setShowTagSuggestions(true)
	}

	const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if ((e.key === 'Enter' || e.key === ',') && tagInputValue.trim()) {
			e.preventDefault()
			addTag(tagInputValue.trim())
		} else if (e.key === 'ArrowDown') {
			e.preventDefault()
			const first = document.getElementById('tag-suggestion-0')
			if (first) first.focus()
		} else if (e.key === 'Escape') {
			setShowTagSuggestions(false)
			tagInputRef.current?.blur()
		}
	}

	const addTag = (tag: string) => {
		const value = tag.toLowerCase()
		const tagExists = watchedTags.some(t => t.toLowerCase() === value)

		if (value && !tagExists) {
			const tags = Array.from(new Set([...watchedTags, tag]))
			setValue('tagTitles', tags)
		}
		setTagInputValue('')
		setShowTagSuggestions(false)
	}

	const handleTagSuggestionClick = (tag: string) => {
		addTag(tag)
		tagInputRef.current?.focus()
	}

	const handleTagSuggestionKeyDown = (
		e: React.KeyboardEvent<HTMLButtonElement>,
		tag: string
	) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault()
			handleTagSuggestionClick(tag)
		} else if (e.key === 'ArrowDown') {
			e.preventDefault()
			const currentIndex = parseInt(e.currentTarget.id.split('-').pop() || '0')
			const next = document.getElementById(`tag-suggestion-${currentIndex + 1}`)
			if (next) next.focus()
		} else if (e.key === 'ArrowUp') {
			e.preventDefault()
			const currentIndex = parseInt(e.currentTarget.id.split('-').pop() || '0')
			if (currentIndex === 0) {
				tagInputRef.current?.focus()
			} else {
				const prev = document.getElementById(
					`tag-suggestion-${currentIndex - 1}`
				)
				if (prev) prev.focus()
			}
		} else if (e.key === 'Escape') {
			setShowTagSuggestions(false)
			tagInputRef.current?.focus()
		}
	}

	const removeTag = (tag: string) => {
		const tags = watchedTags.filter(t => t !== tag)
		setValue('tagTitles', tags)
	}

	const removeImage = (url: string) => {
		if (onImageUrlsChange) {
			onImageUrlsChange(imageUrls.filter(u => u !== url))
		}
	}

	// Show suggestions when input has content
	React.useEffect(() => {
		if (tagInputValue.trim()) {
			setShowTagSuggestions(true)
		} else {
			setShowTagSuggestions(false)
		}
	}, [tagInputValue])

	const handleInputBlur = () => {
		setTimeout(() => {
			setShowTagSuggestions(false)
		}, 150)
	}

	// Character count
	const charCount = watchedContent?.length || 0
	const wordCount =
		watchedContent?.split(/\s+/).filter(word => word.length > 0).length || 0

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className='max-w-7xl mx-auto'
		>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className='bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-100 overflow-hidden'
			>
				{/* Header */}
				<div className='bg-gradient-to-r from-accent to-blue-600 text-white p-8'>
					<div className='flex items-center gap-3 mb-4'>
						<Pencil className='w-8 h-8' />
						<h1 className='text-3xl font-bold tracking-tight'>
							Tạo Bài Viết Mới
						</h1>
					</div>
					<p className='text-blue-100 text-lg'>
						Chia sẻ kiến thức và kinh nghiệm với cộng đồng diễn đàn
					</p>
				</div>

				<div className='p-8 space-y-8'>
					{/* Basic Information Section */}
					<div className='bg-gray-50 rounded-2xl p-6'>
						<h2 className='text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2'>
							<FileText className='w-5 h-5 text-accent' />
							Thông Tin Cơ Bản
						</h2>

						<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
							<div className='space-y-4'>
								<FloatingLabelInput
									label='Tiêu đề bài viết'
									id='blog-title'
									value={watchedTitle}
									onChange={e => setValue('title', e.target.value)}
									required
									error={
										errors.title
											? { errors: ['Tiêu đề là bắt buộc'] }
											: undefined
									}
								/>

								<FloatingLabelInput
									label='Tên tác giả'
									id='blog-author'
									value={watchedAuthor}
									onChange={e => setValue('author', e.target.value)}
									required
									error={
										errors.author
											? { errors: ['Tên tác giả là bắt buộc'] }
											: undefined
									}
								/>
							</div>

							<div className='space-y-4'>
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										Hình ảnh đại diện
									</label>
									<CloudinaryButton
										text='Tải lên hình ảnh'
										onUploaded={url => {
											if (onImageUrlsChange) {
												onImageUrlsChange([...imageUrls, url])
											}
										}}
										className='w-full'
									/>
								</div>

								{/* Image Preview */}
								{imageUrls.length > 0 && (
									<div className='space-y-2'>
										<label className='block text-sm font-medium text-gray-700'>
											Hình ảnh đã tải ({imageUrls.length})
										</label>
										<div className='flex flex-wrap gap-2'>
											{imageUrls.map((url, idx) => (
												<motion.div
													key={url}
													initial={{ scale: 0.8, opacity: 0 }}
													animate={{ scale: 1, opacity: 1 }}
													className='relative group'
												>
													<Image
														src={url}
														alt={`Featured ${idx + 1}`}
														className='w-16 h-16 object-cover rounded-lg shadow-md'
														width={64}
														height={64}
													/>
													<button
														type='button'
														onClick={() => removeImage(url)}
														className='absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity'
													>
														<X className='w-3 h-3' />
													</button>
												</motion.div>
											))}
										</div>
									</div>
								)}
							</div>
						</div>
					</div>

					{/* Content Section */}
					<div className='bg-gray-50 rounded-2xl p-6'>
						<div className='flex items-center justify-between mb-6'>
							<h2 className='text-xl font-semibold text-gray-800 flex items-center gap-2'>
								<FileText className='w-5 h-5 text-accent' />
								Nội dung bài viết
							</h2>

							<div className='flex items-center gap-2'>
								<button
									type='button'
									onClick={() => setShowMarkdownHelp(!showMarkdownHelp)}
									className='flex items-center gap-1 text-sm text-gray-600 hover:text-accent transition-colors'
								>
									<HelpCircle className='w-4 h-4' />
									Hướng dẫn Markdown
								</button>

								<div className='flex items-center gap-1 text-sm text-gray-500'>
									<span>{wordCount} từ</span>
									<span>•</span>
									<span>{charCount} ký tự</span>
								</div>
							</div>
						</div>

						{/* Markdown Help Tooltip */}
						<AnimatePresence>
							{showMarkdownHelp && (
								<motion.div
									initial={{ opacity: 0, height: 0 }}
									animate={{ opacity: 1, height: 'auto' }}
									exit={{ opacity: 0, height: 0 }}
									className='mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4'
								>
									<h4 className='font-medium text-blue-800 mb-2'>
										Hướng dẫn Markdown nhanh:
									</h4>
									<div className='grid grid-cols-2 md:grid-cols-4 gap-2 text-sm'>
										<div>
											<code className='bg-blue-100 px-1 rounded'>**bold**</code>{' '}
											<span className='text-blue-700'>Chữ đậm</span>
										</div>
										<div>
											<code className='bg-blue-100 px-1 rounded'>*italic*</code>{' '}
											<span className='text-blue-700'>Chữ nghiêng</span>
										</div>
										<div>
											<code className='bg-blue-100 px-1 rounded'>
												# Heading
											</code>{' '}
											<span className='text-blue-700'>Tiêu đề lớn</span>
										</div>
										<div>
											<code className='bg-blue-100 px-1 rounded'>
												## Subheading
											</code>{' '}
											<span className='text-blue-700'>Tiêu đề nhỏ</span>
										</div>
										<div>
											<code className='bg-blue-100 px-1 rounded'>
												[link](url)
											</code>{' '}
											<span className='text-blue-700'>Hyperlink</span>
										</div>
										<div>
											<code className='bg-blue-100 px-1 rounded'>
												![alt](url)
											</code>{' '}
											<span className='text-blue-700'>Image</span>
										</div>
										<div>
											<code className='bg-blue-100 px-1 rounded'>- item</code>{' '}
											<span className='text-blue-700'>Bullet list</span>
										</div>
										<div>
											<code className='bg-blue-100 px-1 rounded'>1. item</code>{' '}
											<span className='text-blue-700'>Numbered list</span>
										</div>
									</div>
								</motion.div>
							)}
						</AnimatePresence>

						{/* Editable Preview */}
						<div className='space-y-4'>
							{/* Image Upload Button */}
							<div className='flex items-center gap-4 p-3 bg-blue-50 rounded-lg border border-blue-200'>
								<CloudinaryButton
									text='Chèn hình ảnh'
									onUploaded={url => {
										// Insert image markdown at the end of content
										setValue(
											'content',
											(watchedContent || '') + `\n![image](${url})`
										)
									}}
									className='flex-shrink-0'
								/>
								<div className='text-sm text-blue-700'>
									<Info className='w-4 h-4 inline mr-1' />
									Tải lên hình ảnh để chèn vào nội dung
								</div>
							</div>

							{/* Editable Preview Editor */}
							<EditablePreview
								value={watchedContent || ''}
								onChange={value => setValue('content', value)}
								placeholder='Bắt đầu viết bài viết của bạn tại đây...\n\nSử dụng thanh công cụ phía trên để định dạng hoặc nhấp "Edit" để chuyển sang chế độ markdown.'
							/>

							{!watchedContent && (
								<p className='text-sm text-red-500 flex items-center gap-1'>
									<X className='w-4 h-4' />
									Nội dung là bắt buộc
								</p>
							)}
						</div>
					</div>

					{/* Tags Section */}
					<div className='bg-gray-50 rounded-2xl p-6'>
						<h2 className='text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2'>
							<Tag className='w-5 h-5 text-accent' />
							Thẻ & Danh mục
						</h2>

						<div className='space-y-4'>
							{/* Category Filter */}
							<div>
								<label className='block text-sm font-medium text-gray-700 mb-2'>
									Lọc theo danh mục
								</label>
								<select
									value={selectedCategory}
									onChange={e => setSelectedCategory(e.target.value)}
									className='w-full md:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent'
								>
									<option value='all'>Tất cả danh mục</option>
									<option value='health'>Sức khỏe & Thể chất</option>
									<option value='lifestyle'>Lối sống</option>
									<option value='activities'>Hoạt động</option>
									<option value='medical'>Y tế</option>
								</select>
							</div>

							{/* Selected Tags */}
							<div>
								<label className='block text-sm font-medium text-gray-700 mb-2'>
									Thẻ đã chọn ({watchedTags.length})
								</label>
								<div className='flex flex-wrap gap-2 mb-3'>
									{watchedTags.map(tag => (
										<motion.span
											key={tag}
											initial={{ scale: 0.8, opacity: 0 }}
											animate={{ scale: 1, opacity: 1 }}
											className='bg-accent text-white px-3 py-1 rounded-full flex items-center gap-2 shadow-sm hover:bg-blue-700 transition-colors group'
										>
											<span className='font-medium'>{tag}</span>
											<button
												type='button'
												onClick={() => removeTag(tag)}
												className='text-blue-100 hover:text-white transition-colors'
												aria-label='Remove tag'
											>
												<X className='w-3 h-3' />
											</button>
										</motion.span>
									))}
									{watchedTags.length === 0 && (
										<p className='text-gray-500 text-sm italic'>
											Chưa chọn thẻ nào
										</p>
									)}
								</div>
							</div>

							{/* Tag Input */}
							<div className='relative'>
								<input
									ref={tagInputRef}
									type='text'
									value={tagInputValue}
									onChange={handleTagInputChange}
									onKeyDown={handleTagInputKeyDown}
									onBlur={handleInputBlur}
									placeholder='Nhập thẻ và nhấn Enter, hoặc chọn từ gợi ý bên dưới'
									className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent shadow-sm'
									autoComplete='off'
								/>

								{/* Tag Suggestions */}
								<AnimatePresence>
									{showTagSuggestions && (
										<motion.div
											initial={{ opacity: 0, y: -10 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: -10 }}
											className='absolute z-50 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-48 overflow-auto'
										>
											{filteredSuggestions.length > 0 ? (
												<div className='p-2'>
													<div className='text-xs font-medium text-gray-500 mb-2 px-2'>
														Gợi ý ({filteredSuggestions.length})
													</div>
													{filteredSuggestions.map((tag, idx) => (
														<button
															key={tag}
															id={`tag-suggestion-${idx}`}
															type='button'
															onClick={() => handleTagSuggestionClick(tag)}
															onKeyDown={e =>
																handleTagSuggestionKeyDown(e, tag)
															}
															className='w-full text-left px-3 py-2 text-sm hover:bg-blue-50 focus:bg-blue-50 focus:outline-none rounded transition-colors'
														>
															{tag}
														</button>
													))}
												</div>
											) : (
												<div className='p-3 text-center text-gray-500 text-sm'>
													{tagInputValue.trim() ? (
														<>
															<p>Không tìm thấy thẻ phù hợp</p>
															<p className='text-xs mt-1'>
																Nhấn Enter để thêm {tagInputValue.trim()}
															</p>
														</>
													) : (
														<p>Bắt đầu nhập để xem gợi ý</p>
													)}
												</div>
											)}
										</motion.div>
									)}
								</AnimatePresence>
							</div>
						</div>
					</div>

					{/* Submit Section */}
					<div className='flex items-center justify-between pt-6 border-t border-gray-200'>
						<div className='text-sm text-gray-500'>
							{watchedTitle && watchedAuthor && watchedContent ? (
								<span className='text-green-600 flex items-center gap-1'>
									✓ Sẵn sàng đăng bài
								</span>
							) : (
								<span className='flex items-center gap-1'>
									<Info className='w-4 h-4' />
									Hoàn thành tất cả các trường bắt buộc để đăng bài
								</span>
							)}
						</div>

						<motion.button
							type='submit'
							disabled={
								loading || !watchedTitle || !watchedAuthor || !watchedContent
							}
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							className='bg-gradient-to-r from-accent to-blue-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2'
						>
							{loading ? (
								<>
									<div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
									Đang đăng bài...
								</>
							) : (
								<>
									<Save className='w-4 h-4' />
									Đăng bài viết
								</>
							)}
						</motion.button>
					</div>
				</div>
			</form>
		</motion.div>
	)
}

export default BlogForm
