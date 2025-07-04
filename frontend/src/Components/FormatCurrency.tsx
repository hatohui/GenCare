'use client'
import React from 'react'

export default function FormatCurrency({ amount }: { amount: number }) {
	return (
		<>
			{new Intl.NumberFormat('vi-VN', {
				style: 'currency',
				currency: 'VND',
				minimumFractionDigits: 0,
			}).format(amount)}
		</>
	)
}
