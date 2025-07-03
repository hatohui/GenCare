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
	tagId?: string[]
}

export type Blogs = Blog[]
