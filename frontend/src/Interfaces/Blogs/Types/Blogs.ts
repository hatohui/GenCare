export type Blog = {
	id: string
	title: string
	content: string
	author: string
	publishedAt?: Date
	createdAt: Date
	createdBy?: string
	updatedAt: Date
	updatedBy?: string
	deletedAt?: Date
	deletedBy?: string
	isDeleted: boolean
	imageUrls?: string[]
	tagTitle?: string[]
	comments?: number
	likes?: number
}

export type Blogs = Blog[]

export type CreateBlog = {
	title: string
	content: string
	author: string
	imageUrls?: string[]
	tagTitle?: string[]
}
export type Comment = {
	id: string
	content: string
	accountId: string
	accountName?: string
	createdAt: Date
	updatedAt: Date
	updatedBy?: string
	deletedAt?: Date
	deletedBy?: string
	isDeleted: boolean
	like?: number
}

export type Comments = Comment[]

export type CreateComment = {
	content: string
	blogId: string
}
