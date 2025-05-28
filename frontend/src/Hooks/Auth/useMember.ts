import { Role } from '@/Enums/Role'
import { Account } from '@/Interfaces/Auth/Types/Account'
import { create } from 'zustand'

interface MemberState {
	member: Account
}

const useMemberStore = create<MemberState>(set => {
	return {
		member: {
			id: '',
			role: Role.Member,
			email: '',
			firstName: '',
			lastName: '',
			phoneNumber: '',
			dateOfBirth: '',
			avatarUrl: '',
			deletedAt: '',
			isDeleted: false,
		},
	}
})
