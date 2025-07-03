import axios from 'axios'
import { DEFAULT_API_URL } from '@/Constants/API'
import { Blogs } from '@/Interfaces/Blogs/Types/Blogs'
import { useQuery } from '@tanstack/react-query'

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
		return axios
			.get<Blogs>(
				`${BLOG_URL}?Page=${page}&Count=${count}` +
					(search ? `&Search=${search}` : '') +
					(tags ? `&Tags=${tags}` : '')
			)
			.then(res => res.data)
	},
	CreateBlog: (header: string, data: any) => {
		return axios
			.post(`${BLOG_URL}`, data, {
				headers: { Authorization: header },
			})
			.then(res => res.data)
	},
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
