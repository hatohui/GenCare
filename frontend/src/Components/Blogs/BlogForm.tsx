'use client'

import React from 'react'
import { useForm, Controller } from 'react-hook-form'
// You may need to install and import a markdown editor, e.g. react-markdown-editor-lite or react-simplemde-editor
import SimpleMDE from 'react-simplemde-editor'
import 'easymde/dist/easymde.min.css'
import FloatingLabelInput from '../Form/FloatingLabel'
import Button from '../Button'
import ReactMarkdown from 'react-markdown'
import { CloudinaryButton } from '../CloudinaryButton'
import { Pencil } from 'lucide-react'
// Cloudinary upload widget (assume you have a utility or use the widget directly)
// import { openCloudinaryWidget } from '../../Utils/cloudinary';

export type BlogCreateInput = {
	title: string
	content: string
	author: string
	tagId?: string[]
	imageUrls?: string[]
}

interface BlogFormProps {
	onSubmit: (data: BlogCreateInput) => void
	loading?: boolean
	imageUrls?: string[]
	onImageUrlsChange?: (urls: string[]) => void
}

export const BlogForm: React.FC<BlogFormProps> = ({
	onSubmit,
	loading,
	imageUrls = [],
	onImageUrlsChange,
}) => {
	const {
		register,
		handleSubmit,
		control,
		setValue,
		formState: { errors },
		watch,
	} = useForm<BlogCreateInput>({
		defaultValues: {
			title: '',
			content: '',
			author: '',
			tagId: [],
			imageUrls: [],
		},
	})

	// Tag input state for better UX
	const tagInput = React.useRef<HTMLInputElement>(null)

	// Mock tag list for autocomplete
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
	const [tagInputValue, setTagInputValue] = React.useState('')
	const [showTagSuggestions, setShowTagSuggestions] = React.useState(false)
	const tagInputRef = React.useRef<HTMLInputElement>(null)

	// Filter suggestions based on input and exclude already selected tags
	const filteredSuggestions = TAG_SUGGESTIONS.filter(
		tag =>
			tag.toLowerCase().includes(tagInputValue.toLowerCase()) &&
			!(watch('tagId') || []).includes(tag)
	)

	// Handle tag input as chips with autocomplete
	const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTagInputValue(e.target.value)
		setShowTagSuggestions(true)
	}

	const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if ((e.key === 'Enter' || e.key === ',') && tagInputValue.trim()) {
			e.preventDefault()
			const value = tagInputValue.trim()
			if (value && !(watch('tagId') || []).includes(value)) {
				const tags = Array.from(new Set([...(watch('tagId') || []), value]))
				setValue('tagId', tags)
			}
			setTagInputValue('')
			setShowTagSuggestions(false)
		} else if (e.key === 'ArrowDown') {
			// Focus first suggestion
			const first = document.getElementById('tag-suggestion-0')
			if (first) first.focus()
		}
	}

	const handleTagSuggestionClick = (tag: string) => {
		const tags = Array.from(new Set([...(watch('tagId') || []), tag]))
		setValue('tagId', tags)
		setTagInputValue('')
		setShowTagSuggestions(false)
		tagInputRef.current?.focus()
	}

	// Remove tag
	const removeTag = (tag: string) => {
		const tags = (watch('tagId') || []).filter(t => t !== tag)
		setValue('tagId', tags)
	}

	// Remove image
	const removeImage = (url: string) => {
		if (onImageUrlsChange) {
			onImageUrlsChange(imageUrls.filter(u => u !== url))
		}
	}

	const mdeInstanceRef = React.useRef<any>(null)

	// Attach paste handler for image URLs
	React.useEffect(() => {
		const mde = mdeInstanceRef.current
		if (!mde) return
		const cm = mde.codemirror
		const handlePaste = (cm: any, event: ClipboardEvent) => {
			const pasted = event.clipboardData?.getData('text')
			if (
				pasted &&
				/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)$/i.test(pasted.trim())
			) {
				event.preventDefault()
				const doc = cm.getDoc()
				const pos = doc.getCursor()
				doc.replaceRange(`![](${pasted.trim()})`, pos)
			}
		}
		cm.on('paste', handlePaste)
		return () => {
			cm.off('paste', handlePaste)
		}
	}, [mdeInstanceRef.current])

	// Insert image markdown at cursor
	const insertImageAtCursor = (url: string) => {
		if (mdeInstanceRef.current) {
			const cm = mdeInstanceRef.current.codemirror
			const doc = cm.getDoc()
			const pos = doc.getCursor()
			doc.replaceRange(`![image](${url})`, pos)
		} else {
			// fallback: append to content
			setValue('content', (watch('content') || '') + `\n![image](${url})`)
		}
	}

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className='max-w-6xl mx-auto bg-white/90 p-8 rounded-[30px] shadow-2xl border border-gray-100 space-y-8 backdrop-blur-md'
			style={{ backdropFilter: 'blur(6px)' }}
		>
			<h2 className='text-3xl font-bold mb-4 text-accent drop-shadow-sm tracking-tight flex items-center gap-2'>
				<Pencil className='w-8 h-8 text-accent' />
				New Blog Post
			</h2>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
				<div className='flex flex-col gap-2'>
					<FloatingLabelInput
						label='Title'
						id='blog-title'
						value={watch('title')}
						onChange={e => setValue('title', e.target.value)}
						required
						error={errors.title ? { errors: ['Title is required'] } : undefined}
						className='mb-2'
					/>
					{/* CloudinaryButton for title image upload */}
					<CloudinaryButton
						text='Upload Title Image'
						onUploaded={(url, _publicId) => {
							if (onImageUrlsChange) {
								onImageUrlsChange([...imageUrls, url])
							}
						}}
						className='mt-2'
					/>
					{/* Preview uploaded images */}
					{imageUrls && imageUrls.length > 0 && (
						<div className='flex flex-wrap gap-2 mt-2'>
							{imageUrls.map((url, idx) => (
								<div key={url} className='relative'>
									<img
										src={url}
										alt={`Uploaded ${idx + 1}`}
										className='w-20 h-20 object-cover rounded shadow'
									/>
									<button
										type='button'
										className='absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs'
										onClick={() => removeImage(url)}
									>
										&times;
									</button>
								</div>
							))}
						</div>
					)}
				</div>
				<FloatingLabelInput
					label='Author'
					id='blog-author'
					value={watch('author')}
					onChange={e => setValue('author', e.target.value)}
					required
					error={errors.author ? { errors: ['Author is required'] } : undefined}
					className='mb-2'
				/>
			</div>
			<div className='mb-4 flex items-center gap-4'>
				<CloudinaryButton
					text='Upload Image'
					onUploaded={url => insertImageAtCursor(url)}
				/>
				<span className='text-xs text-gray-500'>
					Upload and insert image into your content
				</span>
			</div>
			<div>
				<label className='block text-base font-semibold text-gray-700 mb-2'>
					Content (Markdown)
				</label>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					<div className='rounded-lg border border-gray-200 overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-accent min-h-[220px]'>
						<Controller
							name='content'
							control={control}
							rules={{ required: 'Content is required' }}
							render={({ field }) => (
								<SimpleMDE
									{...field}
									getMdeInstance={instance => {
										mdeInstanceRef.current = instance
									}}
								/>
							)}
						/>
						{errors.content && (
							<p className='text-sm text-red-500 mt-1'>Content is required</p>
						)}
					</div>
					<div className='prose prose-blue max-w-none bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-inner min-h-[220px] overflow-auto'>
						<label className='block text-xs font-semibold text-gray-500 mb-1'>
							Preview
						</label>
						<ReactMarkdown>{watch('content') || ''}</ReactMarkdown>
					</div>
				</div>
				<div className='mt-2 text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded p-2 max-w-xl'>
					<b>Markdown tips:</b> <br />
					<span>**bold**</span> &nbsp; <span>_italic_</span> &nbsp;{' '}
					<span>[link](url)</span> &nbsp; <span># Heading</span> &nbsp;{' '}
					<span>- List item</span>
				</div>
			</div>
			<div>
				<label className='block text-base font-semibold text-gray-700 mb-2'>
					Tags
				</label>
				<div className='flex flex-wrap gap-2 mb-2'>
					{(watch('tagId') || []).map(tag => (
						<span
							key={tag}
							className='bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center shadow-sm hover:bg-blue-200 transition group'
						>
							<span className='font-medium'>{tag}</span>
							<button
								type='button'
								className='ml-2 text-red-400 hover:text-red-700 font-bold text-lg group-hover:scale-110 transition'
								onClick={() => removeTag(tag)}
								aria-label='Remove tag'
							>
								&times;
							</button>
						</span>
					))}
				</div>
				<div className='relative'>
					<input
						ref={tagInputRef}
						type='text'
						value={tagInputValue}
						onChange={handleTagInputChange}
						onKeyDown={handleTagInputKeyDown}
						placeholder='Type tag and press Enter'
						className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none shadow-sm bg-white/80'
						autoComplete='off'
						onBlur={() => setTimeout(() => setShowTagSuggestions(false), 100)}
						onFocus={() => tagInputValue && setShowTagSuggestions(true)}
					/>
					{showTagSuggestions && filteredSuggestions.length > 0 && (
						<ul className='absolute z-10 left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-40 overflow-auto animate-fade-in'>
							{filteredSuggestions.map((tag, idx) => (
								<li
									key={tag}
									id={`tag-suggestion-${idx}`}
									tabIndex={0}
									className='px-4 py-2 cursor-pointer hover:bg-blue-100 focus:bg-blue-100 text-gray-700'
									onClick={() => handleTagSuggestionClick(tag)}
									onKeyDown={e => {
										if (e.key === 'Enter') handleTagSuggestionClick(tag)
									}}
								>
									{tag}
								</li>
							))}
						</ul>
					)}
				</div>
			</div>
			<div>
				<label className='block text-base font-semibold text-gray-700 mb-2'>
					Images
				</label>
				<ul className='flex flex-wrap gap-4 mb-2'>
					{imageUrls.map((url, idx) => (
						<li key={idx} className='relative group'>
							<a href={url} target='_blank' rel='noopener noreferrer'>
								<img
									src={url}
									alt='media'
									className='w-28 h-28 object-cover rounded-lg border-2 border-gray-200 shadow-md hover:scale-105 transition'
								/>
							</a>
							{onImageUrlsChange && (
								<button
									type='button'
									className='absolute top-1 right-1 bg-white bg-opacity-90 rounded-full p-1 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition shadow'
									onClick={() => removeImage(url)}
									aria-label='Remove image'
								>
									&times;
								</button>
							)}
						</li>
					))}
				</ul>
			</div>
			<div className='flex justify-end gap-2 mt-6'>
				<button
					type='submit'
					className='bg-accent text-white z-30 text-base font-semibold px-8 py-3 rounded-full hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-accent/20'
					disabled={loading}
				>
					Create Blog
				</button>
			</div>
		</form>
	)
}

export default BlogForm
