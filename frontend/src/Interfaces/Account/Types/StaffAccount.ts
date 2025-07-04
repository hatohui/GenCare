import { Account } from '@/Interfaces/Auth/Types/Account'
import { StaffInfo } from './StaffInfo'

export type StaffAccount = Account & {
	staffInfo?: Omit<StaffInfo, 'accountId'> & { departmentName: string }
}
