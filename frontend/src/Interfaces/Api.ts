export type GetUserDTO = User & {
	images: string[]
	objects: {
		hello: string
		world: string
		objectinobject: {}
	}
}

export type User = {
	name: string
	age: string
}
