import { Suspense } from 'react'

// Force this page to be dynamic (not prerendered)
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function BlogCreateLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
}
