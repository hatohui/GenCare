import { Account } from '@/Interfaces/Auth/Types/Account'
import { Department } from './Department'
import { StaffInfo } from './StaffInfo'

export type StaffAccount = Account &
	Omit<Department, 'id'> &
	Omit<StaffInfo, 'accountId' | 'departmentId'>
