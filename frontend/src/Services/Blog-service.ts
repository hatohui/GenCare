import axios from 'axios'
import { DEFAULT_API_URL } from '@/Constants/API'
import { Blogs, CreateBlog } from '@/Interfaces/Blogs/Types/Blogs'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAccessTokenHeader } from '@/Utils/Auth/getAccessTokenHeader'

const BLOG_URL = `${DEFAULT_API_URL}/blogs`

const blogApi = {
	GetBlogById: (id: string) => {
		return axios.get(`${BLOG_URL}/${id}`).then(res => res.data)
	},
	GetBlogs: (
		page: number,
		count: number,
		search?: string | null,
		tags?: string | null
	) => {
		console.log(
			`${BLOG_URL}?Page=${page}&Count=${count}` +
				(search ? `&Search=${search}` : '') +
				(tags ? `&Tags=${tags}` : '')
		)

		return axios
			.get<Blogs>(
				`${BLOG_URL}?Page=${page}&Count=${count}` +
					(search ? `&Search=${search}` : '') +
					(tags ? `&Tags=${tags}` : '')
			)
			.then(res => res.data)
	},
	CreateBlog: (header: string, data: CreateBlog) => {
		return axios
			.post(`${BLOG_URL}`, data, {
				headers: { Authorization: header },
			})
			.then(res => res.data)
	},
}

export const useGetBlogById = (id: string) => {
	return useQuery({
		queryKey: ['blog', id],
		queryFn: () => blogApi.GetBlogById(id),
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
	})
}

export const useCreateBlog = () => {
	const header = useAccessTokenHeader()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (data: CreateBlog) => blogApi.CreateBlog(header, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['blogs'] })
		},
	})
}
