import axios from 'axios'
import { DEFAULT_API_URL } from '@/Constants/API'
import {
	Blog,
	Blogs,
	Comments,
	CreateBlog,
	CreateComment,
} from '@/Interfaces/Blogs/Types/Blogs'
import {
	useMutation,
	useQuery,
	useQueryClient,
	useInfiniteQuery,
} from '@tanstack/react-query'
import { useAccessTokenHeader } from '@/Utils/Auth/getAccessTokenHeader'

const BLOG_URL = `${DEFAULT_API_URL}/api/blogs`
const COMMENT_URL = `${DEFAULT_API_URL}/api/comments`

const blogApi = {
	GetBlogById: (id: string) => {
		return axios.get<Blog>(`${BLOG_URL}/${id}`).then(res => res.data)
	},
	GetBlogs: (
		page: number,
		count: number,
		search?: string | null,
		tags?: string | null
	) => {
		const params = new URLSearchParams({
			Page: page.toString(),
			Count: count.toString(),
		})

		if (search && search.trim()) params.append('Search', search.trim())
		if (tags && tags.trim()) params.append('Tags', tags.trim())

		const url = `${BLOG_URL}?${params.toString()}`

		return axios
			.get<Blogs>(url)
			.then(res => {
				return res.data
			})
			.catch(error => {
				console.error('Failed to fetch blogs:', error)
				throw error
			})
	},
	CreateBlog: (header: string, data: CreateBlog) => {
		return axios
			.post(`${BLOG_URL}`, data, {
				headers: { Authorization: header },
			})
			.then(res => res.data)
	},
	UpdateBlog: (header: string, id: string, data: CreateBlog) => {
		return axios
			.put(`${BLOG_URL}/${id}`, data, {
				headers: { Authorization: header },
			})
			.then(res => res.data)
	},
	DeleteBlog: (header: string, id: string) => {
		return axios
			.delete(`${BLOG_URL}/${id}`, {
				headers: { Authorization: header },
			})
			.then(res => res.data)
	},
	// Comments API
	GetComments: (blogId: string) => {
		return axios
			.get<Comments>(`${COMMENT_URL}?blogId=${blogId}`)
			.then(res => res.data)
	},
	CreateComment: (header: string, data: CreateComment) => {
		return axios
			.post(`${COMMENT_URL}`, data, {
				headers: { Authorization: header },
			})
			.then(res => res.data)
	},
	DeleteComment: (header: string, id: string) => {
		return axios
			.delete(`${COMMENT_URL}/${id}`, {
				headers: { Authorization: header },
			})
			.then(res => res.data)
	},
	LikeBlog: (header: string, id: string) => {
		return axios
			.post(
				`${BLOG_URL}/${id}/like`,
				{},
				{
					headers: { Authorization: header },
				}
			)
			.then(res => res.data)
	},
	LikeComment: (header: string, id: string) => {
		return axios
			.post(`${COMMENT_URL}/${id}/like`, null, {
				headers: { Authorization: header },
			})
			.then(res => res.data)
	},
}

export const useGetBlogById = (id: string) => {
	return useQuery({
		queryKey: ['blog', id],
		queryFn: () => blogApi.GetBlogById(id),
		enabled: !!id,
	})
}

export const useGetBlogs = (
	page: number,
	count: number,
	search?: string | null,
	tags?: string | null
) => {
	return useQuery({
		queryKey: ['blogs', page, count, search, tags],
		queryFn: () => blogApi.GetBlogs(page, count, search, tags),
		enabled: page > 0 && count > 0,
	})
}

export const useInfiniteBlogs = (
	count: number,
	search?: string | null,
	tags?: string | null
) => {
	return useInfiniteQuery({
		queryKey: ['infinite-blogs', count, search, tags],
		queryFn: ({ pageParam = 1 }) =>
			blogApi.GetBlogs(pageParam, count, search, tags),
		initialPageParam: 1,
		getNextPageParam: (lastPage, allPages) => {
			// Check if we have more data to fetch
			// If the last page has fewer items than the count, we've reached the end
			if (!lastPage || lastPage.length < count) {
				return undefined
			}
			return allPages.length + 1
		},
		getPreviousPageParam: (firstPage, allPages) => {
			if (allPages.length <= 1) {
				return undefined
			}
			return allPages.length - 1
		},
		enabled: count > 0,
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	})
}

export const useCreateBlog = () => {
	const header = useAccessTokenHeader()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (data: CreateBlog) => blogApi.CreateBlog(header, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['blogs'] })
			queryClient.invalidateQueries({ queryKey: ['infinite-blogs'] })
		},
	})
}

export const useUpdateBlog = () => {
	const header = useAccessTokenHeader()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: CreateBlog }) =>
			blogApi.UpdateBlog(header, id, data),
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({ queryKey: ['blogs'] })
			queryClient.invalidateQueries({ queryKey: ['infinite-blogs'] })
			queryClient.invalidateQueries({ queryKey: ['blog', id] })
		},
	})
}

export const useDeleteBlog = () => {
	const header = useAccessTokenHeader()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (id: string) => blogApi.DeleteBlog(header, id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['blogs'] })
			queryClient.invalidateQueries({ queryKey: ['infinite-blogs'] })
		},
	})
}

// Comments hooks
export const useGetComments = (blogId: string) => {
	return useQuery({
		queryKey: ['comments', blogId],
		queryFn: () => blogApi.GetComments(blogId),
		enabled: !!blogId,
	})
}

export const useCreateComment = () => {
	const header = useAccessTokenHeader()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (data: CreateComment) => blogApi.CreateComment(header, data),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ['comments', variables.blogId],
			})
			queryClient.invalidateQueries({ queryKey: ['blogs'] })
			queryClient.invalidateQueries({ queryKey: ['infinite-blogs'] })
		},
	})
}

export const useDeleteComment = () => {
	const header = useAccessTokenHeader()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (id: string) => blogApi.DeleteComment(header, id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['comments'] })
			queryClient.invalidateQueries({ queryKey: ['blogs'] })
			queryClient.invalidateQueries({ queryKey: ['infinite-blogs'] })
		},
	})
}

export const useLikeBlog = () => {
	const header = useAccessTokenHeader()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (id: string) => blogApi.LikeBlog(header, id),
		onMutate: async id => {
			// Cancel any outgoing refetches
			await queryClient.cancelQueries({ queryKey: ['blog', id] })
			await queryClient.cancelQueries({ queryKey: ['blogs'] })
			await queryClient.cancelQueries({ queryKey: ['infinite-blogs'] })

			// Snapshot the previous value
			const previousBlog = queryClient.getQueryData(['blog', id])
			const previousBlogs = queryClient.getQueryData(['blogs'])
			const previousInfiniteBlogs = queryClient.getQueryData(['infinite-blogs'])

			// Optimistically update the blog
			queryClient.setQueryData(['blog', id], (old: any) => {
				if (old) {
					return { ...old, likes: (old.likes || 0) + 1 }
				}
				return old
			})

			// Optimistically update blogs list
			queryClient.setQueryData(['blogs'], (old: any) => {
				if (old && Array.isArray(old)) {
					return old.map((blog: any) =>
						blog.id === id ? { ...blog, likes: (blog.likes || 0) + 1 } : blog
					)
				}
				return old
			})

			// Optimistically update infinite blogs
			queryClient.setQueryData(['infinite-blogs'], (old: any) => {
				if (old && old.pages) {
					return {
						...old,
						pages: old.pages.map((page: any) =>
							page.map((blog: any) =>
								blog.id === id
									? { ...blog, likes: (blog.likes || 0) + 1 }
									: blog
							)
						),
					}
				}
				return old
			})

			return { previousBlog, previousBlogs, previousInfiniteBlogs }
		},
		onError: (err, id, context) => {
			// Rollback on error
			if (context?.previousBlog) {
				queryClient.setQueryData(['blog', id], context.previousBlog)
			}
			if (context?.previousBlogs) {
				queryClient.setQueryData(['blogs'], context.previousBlogs)
			}
			if (context?.previousInfiniteBlogs) {
				queryClient.setQueryData(
					['infinite-blogs'],
					context.previousInfiniteBlogs
				)
			}
		},
		onSettled: (_, __, id) => {
			// Always refetch after error or success
			queryClient.invalidateQueries({ queryKey: ['blog', id] })
			queryClient.invalidateQueries({ queryKey: ['blogs'] })
			queryClient.invalidateQueries({ queryKey: ['infinite-blogs'] })
		},
	})
}

export const useLikeComment = () => {
	const header = useAccessTokenHeader()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (id: string) => blogApi.LikeComment(header, id),
		onMutate: async id => {
			// Cancel any outgoing refetches
			await queryClient.cancelQueries({ queryKey: ['comments'] })

			// Snapshot the previous value
			const previousComments = queryClient.getQueryData(['comments'])

			// Optimistically update the comment
			queryClient.setQueryData(['comments'], (old: any) => {
				if (old && Array.isArray(old)) {
					return old.map((comment: any) =>
						comment.id === id
							? { ...comment, likes: (comment.likes || 0) + 1 }
							: comment
					)
				}
				return old
			})

			return { previousComments }
		},
		onError: (err, id, context) => {
			// Rollback on error
			if (context?.previousComments) {
				queryClient.setQueryData(['comments'], context.previousComments)
			}
		},
		onSettled: () => {
			// Always refetch after error or success
			queryClient.invalidateQueries({ queryKey: ['comments'] })
			queryClient.invalidateQueries({ queryKey: ['blogs'] })
			queryClient.invalidateQueries({ queryKey: ['infinite-blogs'] })
		},
	})
}
