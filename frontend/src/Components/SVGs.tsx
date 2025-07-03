import clsx from 'clsx'

type SVGProps = {
	className?: string
}

export const SeeSVG = ({ className }: SVGProps) => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		fill='none'
		viewBox='0 0 24 24'
		strokeWidth={1.5}
		stroke='currentColor'
		className={clsx(className, 'size-6')}
	>
		<path
			strokeLinecap='round'
			strokeLinejoin='round'
			d='M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z'
		/>
		<path
			strokeLinecap='round'
			strokeLinejoin='round'
			d='M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z'
		/>
	</svg>
)

export const NoSeeSVG = ({ className }: SVGProps) => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		fill='none'
		viewBox='0 0 24 24'
		strokeWidth={1.5}
		stroke='currentColor'
		className={clsx(className, 'size-6')}
	>
		<path
			strokeLinecap='round'
			strokeLinejoin='round'
			d='M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88'
		/>
	</svg>
)

export const UserSVG = ({ className }: SVGProps) => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		fill='none'
		viewBox='0 0 24 24'
		strokeWidth={1.5}
		stroke='currentColor'
		className={clsx(className, 'size-6')}
	>
		<path
			strokeLinecap='round'
			strokeLinejoin='round'
			d='M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z'
		/>
	</svg>
)

export const HomeSVG = ({ className }: SVGProps) => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		fill='none'
		viewBox='0 0 24 24'
		strokeWidth={1.5}
		stroke='currentColor'
		className={clsx(className, 'size-6')}
	>
		<path
			strokeLinecap='round'
			strokeLinejoin='round'
			d='m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25'
		/>
	</svg>
)

export const MoneySVG = ({ className }: SVGProps) => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		fill='none'
		viewBox='0 0 24 24'
		strokeWidth={1.5}
		stroke='currentColor'
		className={clsx(className, 'size-6')}
	>
		<path
			strokeLinecap='round'
			strokeLinejoin='round'
			d='M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z'
		/>
	</svg>
)

export const AccountSVG = ({ className }: SVGProps) => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		fill='none'
		viewBox='0 0 24 24'
		strokeWidth={1.5}
		stroke='currentColor'
		className={clsx(className, 'size-6')}
	>
		<path
			strokeLinecap='round'
			strokeLinejoin='round'
			d='M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z'
		/>
	</svg>
)

export const CustomerSVG = ({ className }: SVGProps) => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		fill='none'
		viewBox='0 0 24 24'
		strokeWidth={1.5}
		stroke='currentColor'
		className={clsx(className, 'size-6')}
	>
		<path
			strokeLinecap='round'
			strokeLinejoin='round'
			d='M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z'
		/>
	</svg>
)

export const ExitSVG = ({ className }: SVGProps) => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		viewBox='0 0 20 20'
		fill='currentColor'
		className={clsx(className, 'size-6')}
	>
		<path
			fillRule='evenodd'
			d='M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z'
			clipRule='evenodd'
		/>
	</svg>
)

export const TrashCanSVG = ({ className }: SVGProps) => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		fill='none'
		viewBox='0 0 24 24'
		strokeWidth={1.5}
		stroke='currentColor'
		className={clsx(className, 'size-5')}
	>
		<path
			strokeLinecap='round'
			strokeLinejoin='round'
			d='m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0'
		/>
	</svg>
)
export const PencilSVG = ({ className }: SVGProps) => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		viewBox='0 0 20 20'
		fill='currentColor'
		className={clsx(className, 'size-5')}
	>
		<path d='m5.433 13.917 1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65Z' />
		<path d='M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 0 10 3H4.75A2.75 2.75 0 0 0 2 5.75v9.5A2.75 2.75 0 0 0 4.75 18h9.5A2.75 2.75 0 0 0 17 15.25V10a.75.75 0 0 0-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5Z' />
	</svg>
)

export const NextSVG = ({ className }: SVGProps) => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		fill='none'
		viewBox='0 0 24 24'
		strokeWidth={1.5}
		stroke='currentColor'
		className={clsx(className, 'size-5')}
	>
		<path
			strokeLinecap='round'
			strokeLinejoin='round'
			d='m8.25 4.5 7.5 7.5-7.5 7.5'
		/>
	</svg>
)

export const PreviousSVG = ({ className }: SVGProps) => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		fill='none'
		viewBox='0 0 24 24'
		strokeWidth={1.5}
		stroke='currentColor'
		className={clsx(className, 'size-5')}
	>
		<path
			strokeLinecap='round'
			strokeLinejoin='round'
			d='M15.75 19.5 8.25 12l7.5-7.5'
		/>
	</svg>
)

export const PlusSVG = ({ className }: SVGProps) => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		fill='none'
		viewBox='0 0 24 24'
		strokeWidth={1.5}
		stroke='currentColor'
		className={clsx(className, 'size-5')}
	>
		<path
			strokeLinecap='round'
			strokeLinejoin='round'
			d='M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
		/>
	</svg>
)

export const ServiceSVG = ({ className }: SVGProps) => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		fill='none'
		viewBox='0 0 24 24'
		strokeWidth={1.5}
		stroke='currentColor'
		className={clsx(className, 'size-5')}
	>
		<path
			strokeLinecap='round'
			strokeLinejoin='round'
			d='m8.99 14.993 6-6m6 3.001c0 1.268-.63 2.39-1.593 3.069a3.746 3.746 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043 3.745 3.745 0 0 1-3.068 1.593c-1.268 0-2.39-.63-3.068-1.593a3.745 3.745 0 0 1-3.296-1.043 3.746 3.746 0 0 1-1.043-3.297 3.746 3.746 0 0 1-1.593-3.068c0-1.268.63-2.39 1.593-3.068a3.746 3.746 0 0 1 1.043-3.297 3.745 3.745 0 0 1 3.296-1.042 3.745 3.745 0 0 1 3.068-1.594c1.268 0 2.39.63 3.068 1.593a3.745 3.745 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.297 3.746 3.746 0 0 1 1.593 3.068ZM9.74 9.743h.008v.007H9.74v-.007Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm4.125 4.5h.008v.008h-.008v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z'
		/>
	</svg>
)

export const LogoutSVG = ({ className }: SVGProps) => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		fill='none'
		viewBox='0 0 24 24'
		strokeWidth={1.5}
		stroke='currentColor'
		className={clsx(className, 'size-5')}
	>
		<path
			strokeLinecap='round'
			strokeLinejoin='round'
			d='M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15'
		/>
	</svg>
)

export const OptionSVG = ({ className }: SVGProps) => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		viewBox='0 0 20 20'
		fill='currentColor'
		className={clsx(className, 'size-5')}
	>
		<path d='M10 3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM10 8.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM11.5 15.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z' />
	</svg>
)

export const PencilSquareSVG = ({ className }: SVGProps) => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		fill='none'
		viewBox='0 0 24 24'
		strokeWidth={1.5}
		stroke='currentColor'
		className={clsx(className, 'size-5')}
	>
		<path
			strokeLinecap='round'
			strokeLinejoin='round'
			d='m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10'
		/>
	</svg>
)

export const BookingListVSG = ({ className }: SVGProps) => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		fill='none'
		viewBox='0 0 24 24'
		strokeWidth={1.5}
		stroke='currentColor'
		className={clsx(className, 'size-5')}
	>
		<path
			strokeLinecap='round'
			strokeLinejoin='round'
			d='M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75'
		/>
	</svg>
)

export const SearchSVG = ({ className }: SVGProps) => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		fill='none'
		viewBox='0 0 24 24'
		strokeWidth={1.5}
		stroke='currentColor'
		className={clsx(className, 'size-5')}
	>
		<path
			strokeLinecap='round'
			strokeLinejoin='round'
			d='m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z'
		/>
	</svg>
)

export const RestoreSVG = ({ className }: SVGProps) => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		fill='none'
		viewBox='0 0 24 24'
		strokeWidth={1.5}
		stroke='currentColor'
		className={clsx(className, 'size-5')}
	>
		<path
			strokeLinecap='round'
			strokeLinejoin='round'
			d='M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99'
		/>
	</svg>
)

export const HeartSVG = ({ className }: SVGProps) => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		fill='none'
		viewBox='0 0 24 24'
		strokeWidth={1.5}
		stroke='currentColor'
		className={clsx(className, 'size-5')}
	>
		<path
			strokeLinecap='round'
			strokeLinejoin='round'
			d='M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z'
		/>
	</svg>
)

export const XMarkSVG = ({ className }: SVGProps) => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		fill='none'
		viewBox='0 0 24 24'
		strokeWidth={1.5}
		stroke='currentColor'
		className={clsx(className, 'size-6')}
	>
		<path
			strokeLinecap='round'
			strokeLinejoin='round'
			d='M6 18L18 6M6 6l12 12'
		/>
	</svg>
)

export const DocumentSVG = ({ className }: SVGProps) => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		fill='none'
		viewBox='0 0 24 24'
		strokeWidth={1.5}
		stroke='currentColor'
		className={clsx(className, 'size-6')}
	>
		<path
			strokeLinecap='round'
			strokeLinejoin='round'
			d='M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z'
		/>
	</svg>
)

export const DownloadSVG = ({ className }: SVGProps) => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		fill='none'
		viewBox='0 0 24 24'
		strokeWidth={1.5}
		stroke='currentColor'
		className={clsx(className, 'size-6')}
	>
		<path
			strokeLinecap='round'
			strokeLinejoin='round'
			d='M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3'
		/>
	</svg>
)

export const EyeSVG = ({ className }: SVGProps) => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		fill='none'
		viewBox='0 0 24 24'
		strokeWidth={1.5}
		stroke='currentColor'
		className={clsx(className, 'size-5')}
	>
		<path
			strokeLinecap='round'
			strokeLinejoin='round'
			d='M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z'
		/>
		<path
			strokeLinecap='round'
			strokeLinejoin='round'
			d='M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z'
		/>
	</svg>
)

export const CheckCircleSVG = ({ className }: SVGProps) => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		fill='none'
		viewBox='0 0 24 24'
		strokeWidth={1.5}
		stroke='currentColor'
		className={clsx(className, 'size-6')}
	>
		<path
			strokeLinecap='round'
			strokeLinejoin='round'
			d='M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
		/>
	</svg>
)

export const XCircleSVG = ({ className }: SVGProps) => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		fill='none'
		viewBox='0 0 24 24'
		strokeWidth={1.5}
		stroke='currentColor'
		className={clsx(className, 'size-6')}
	>
		<path
			strokeLinecap='round'
			strokeLinejoin='round'
			d='M9.75 9.75l4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
		/>
	</svg>
)

export const ChevronDownSVG = ({ className }: SVGProps) => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		fill='none'
		viewBox='0 0 24 24'
		strokeWidth={1.5}
		stroke='currentColor'
		className={clsx(className, 'size-6')}
	>
		<path
			strokeLinecap='round'
			strokeLinejoin='round'
			d='m19.5 8.25-7.5 7.5-7.5-7.5'
		/>
	</svg>
)

export const ChevronUpSVG = ({ className }: SVGProps) => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		fill='none'
		viewBox='0 0 24 24'
		strokeWidth={1.5}
		stroke='currentColor'
		className={clsx(className, 'size-6')}
	>
		<path
			strokeLinecap='round'
			strokeLinejoin='round'
			d='m4.5 15.75 7.5-7.5 7.5 7.5'
		/>
	</svg>
)

export const ArrowLeftSVG = ({ className }: SVGProps) => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		fill='none'
		viewBox='0 0 24 24'
		strokeWidth={1.5}
		stroke='currentColor'
		className={clsx(className, 'size-6')}
	>
		<path
			strokeLinecap='round'
			strokeLinejoin='round'
			d='M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18'
		/>
	</svg>
)

export const ArrowRightSVG = ({ className }: SVGProps) => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		fill='none'
		viewBox='0 0 24 24'
		strokeWidth={1.5}
		stroke='currentColor'
		className={clsx(className, 'size-6')}
	>
		<path
			strokeLinecap='round'
			strokeLinejoin='round'
			d='M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3'
		/>
	</svg>
)

export const ClockSVG = ({ className }: SVGProps) => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		fill='none'
		viewBox='0 0 24 24'
		strokeWidth={1.5}
		stroke='currentColor'
		className={clsx(className, 'size-6')}
	>
		<circle
			cx='12'
			cy='12'
			r='9'
			stroke='currentColor'
			strokeWidth='1.5'
			fill='none'
		/>
		<path
			strokeLinecap='round'
			strokeLinejoin='round'
			d='M12 7.5v4.25l2.5 2.5'
		/>
	</svg>
)

export const CalendarSVG = ({ className }: SVGProps) => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		fill='none'
		viewBox='0 0 24 24'
		strokeWidth={1.5}
		stroke='currentColor'
		className={clsx(className, 'size-6')}
	>
		<rect
			x='3'
			y='5'
			width='18'
			height='16'
			rx='2'
			stroke='currentColor'
			strokeWidth='1.5'
			fill='none'
		/>
		<path
			strokeLinecap='round'
			strokeLinejoin='round'
			d='M16 3v4M8 3v4M3 9h18'
		/>
	</svg>
)

export const ChatSVG = ({ className }: SVGProps) => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		fill='none'
		viewBox='0 0 24 24'
		strokeWidth={1.5}
		stroke='currentColor'
		className={clsx(className, 'size-6')}
	>
		<path
			strokeLinecap='round'
			strokeLinejoin='round'
			d='M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072m-3.08.433 4.5-4.5m0 0-4.5-4.5m4.5 4.5H9.75'
		/>
	</svg>
)
