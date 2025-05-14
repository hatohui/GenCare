export type GetUserDTO = User & {
	images: string[]
	objects: {
		hello: string
		world: string
		objectinobject: string
	}
}

export type User = {
	name: string
	age: string
}
