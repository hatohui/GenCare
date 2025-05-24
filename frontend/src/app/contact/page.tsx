'use client'
import Loading from '@/Components/Loading'
import { stimulateLoad } from '@/Utils/LoadStimulate'
import React, { useState } from 'react'

const page = () => {
	const [isLoading, setIsLoading] = useState(true)
	stimulateLoad(5000)

	return isLoading ? <Loading /> : <div></div>
}

export default page
