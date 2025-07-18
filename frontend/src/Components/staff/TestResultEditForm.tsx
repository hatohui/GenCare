import React, { useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useGetResult, useUpdateResult } from '@/Services/Result-service'
import LoadingIcon from '../LoadingIcon'
import { ResultData, Result } from '@/Interfaces/Tests/Types/Tests'
import {
	XCircle,
	Plus,
	Trash2,
	FlaskConical,
	Save,
	CheckCircle,
} from 'lucide-react'
import { useLocale } from '@/Hooks/useLocale'

interface TestResultEditFormProps {
	orderDetailId: string
	onSuccess?: () => void
	useMock?: boolean
}

// Simple validation schema
const testParameterSchema = z.object({
	key: z.string().min(1, 'Parameter name is required'),
	value: z.number().min(0, 'Value cannot be negative'),
	unit: z.string().min(1, 'Unit is required'),
	referenceRange: z.string(),
	flag: z.enum(['normal', 'high', 'low']),
})

const formSchema = z
	.object({
		orderDate: z.string().min(1, 'Order date is required'),
		sampleDate: z.string().min(1, 'Sample date is required'),
		resultDate: z.string().optional().nullable(),
		status: z.boolean(),
		testParameters: z.array(testParameterSchema),
	})
	.refine(
		data => {
			if (data.status) {
				return !!data.resultDate && data.resultDate !== ''
			}
			return true
		},
		{
			message: 'Result date is required when completed',
			path: ['resultDate'],
		}
	)

type FormData = z.infer<typeof formSchema>

// Sample data
const SAMPLE_PARAMETERS = [
	{
		key: 'glucose',
		value: 92,
		unit: 'mg/dL',
		referenceRange: '70-100',
		flag: 'normal' as const,
	},
	{
		key: 'cholesterol',
		value: 180,
		unit: 'mg/dL',
		referenceRange: '125-200',
		flag: 'normal' as const,
	},
	{
		key: 'hemoglobin',
		value: 13.5,
		unit: 'g/dL',
		referenceRange: '13.0-17.0',
		flag: 'normal' as const,
	},
]

const TestResultEditForm: React.FC<TestResultEditFormProps> = ({
	orderDetailId,
	onSuccess,
	useMock = false,
}) => {
	const { data, isLoading, error } = useGetResult(orderDetailId)
	const updateResult = useUpdateResult()
	const { t } = useLocale()

	const {
		register,
		handleSubmit,
		control,
		setValue,
		reset,
		watch,
		formState: { errors, isSubmitting },
	} = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			orderDate: '',
			sampleDate: '',
			resultDate: undefined,
			status: false,
			testParameters: [],
		},
	})

	const { fields, append, remove } = useFieldArray({
		control,
		name: 'testParameters',
	})

	// Initialize form data
	useEffect(() => {
		if (useMock) {
			const today = new Date().toISOString().slice(0, 10)
			reset({
				orderDate: today,
				sampleDate: today,
				resultDate: today,
				status: true,
				testParameters: SAMPLE_PARAMETERS,
			})
			return
		}

		if (data) {
			const formatDate = (date: any) => {
				if (!date) return ''
				try {
					return new Date(date).toISOString().slice(0, 10)
				} catch {
					return ''
				}
			}

			const formData: FormData = {
				orderDate: formatDate(data.orderDate),
				sampleDate: formatDate(data.sampleDate),
				resultDate: formatDate(data.resultDate),
				status: !!data.status,
				testParameters: data.resultData
					? Object.entries(data.resultData).map(([key, value]) => ({
							key,
							...value,
					  }))
					: [],
			}
			reset(formData)
		}
	}, [data, useMock, reset])

	const onSubmit = async (formData: FormData) => {
		console.log('Submitting:', formData)

		// Convert test parameters
		const resultData: ResultData = {}
		formData.testParameters.forEach(param => {
			if (param.key.trim()) {
				resultData[param.key] = {
					value: param.value,
					unit: param.unit,
					referenceRange: param.referenceRange,
					flag: param.flag,
				}
			}
		})

		// Prepare update data
		const updateData: Omit<Result, 'orderDetailId'> = {
			orderDate: new Date(formData.orderDate),
			status: formData.status,
			sampleDate: formData.sampleDate
				? new Date(formData.sampleDate)
				: undefined,
			resultDate: formData.resultDate
				? new Date(formData.resultDate)
				: undefined,
			resultData: Object.keys(resultData).length > 0 ? resultData : undefined,
		}

		updateResult.mutate(
			{ id: orderDetailId, data: updateData },
			{
				onSuccess: () => {
					console.log('Update successful')
					if (onSuccess) onSuccess()
				},
				onError: error => console.log('Update error:', error),
			}
		)
	}

	if (isLoading) {
		return (
			<div className='flex justify-center items-center min-h-[400px]'>
				<LoadingIcon className='mx-auto mb-4 size-8' />
				<p className='text-gray-600'>{t('common.loading')}</p>
			</div>
		)
	}

	if (error) {
		return (
			<div className='text-center p-8'>
				<div className='text-red-500 text-6xl mb-4'>⚠️</div>
				<h3 className='text-xl font-semibold mb-2'>
					{t('common.error.load_data')}
				</h3>
				<p className='text-gray-600 mb-4'>
					{t('common.error.try_again_later')}
				</p>
				<button
					onClick={() => window.location.reload()}
					className='bg-main text-white px-6 py-3 rounded-lg hover:bg-main/90'
				>
					{t('test.try_again')}
				</button>
			</div>
		)
	}

	return (
		<div className='bg-white rounded-xl shadow-lg mx-auto overflow-y-auto'>
			{/* Header */}
			<div className='bg-gradient-to-r from-main to-secondary p-6 text-white rounded-t-xl'>
				<h2 className='text-2xl font-bold mb-2'>{t('test.edit_results')}</h2>
				<p className='text-white/80'>
					{t('test.result_code')}: {orderDetailId}
				</p>
			</div>

			{/* Form */}
			<div className='p-6'>
				<form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
					{/* Basic Info */}
					<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								{t('test.order_date')}
							</label>
							<input
								type='date'
								{...register('orderDate')}
								className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main'
							/>
							{errors.orderDate && (
								<p className='text-red-500 text-sm mt-1'>
									{errors.orderDate.message}
								</p>
							)}
						</div>
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								{t('test.sample_date')}
							</label>
							<input
								type='date'
								{...register('sampleDate')}
								className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main'
							/>
							{errors.sampleDate && (
								<p className='text-red-500 text-sm mt-1'>
									{errors.sampleDate.message}
								</p>
							)}
						</div>
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								{t('test.result_date')}
							</label>
							<input
								type='date'
								{...register('resultDate')}
								className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main'
							/>
							{errors.resultDate && (
								<p className='text-red-500 text-sm mt-1'>
									{errors.resultDate.message}
								</p>
							)}
						</div>
					</div>

					{/* Status */}
					<div className='bg-gray-50 p-4 rounded-lg'>
						<h3 className='text-lg font-semibold mb-4 flex items-center gap-2'>
							<CheckCircle className='size-5' />
							{t('test.status')}
						</h3>
						<div className='flex gap-4'>
							<label className='flex items-center gap-2 cursor-pointer'>
								<input
									type='radio'
									checked={watch('status') === false}
									onChange={() => setValue('status', false)}
									className='w-4 h-4 text-main'
								/>
								<XCircle className='size-5 text-yellow-500' />
								<span>{t('test.incomplete')}</span>
							</label>
							<label className='flex items-center gap-2 cursor-pointer'>
								<input
									type='radio'
									checked={watch('status') === true}
									onChange={() => setValue('status', true)}
									className='w-4 h-4 text-main'
								/>
								<CheckCircle className='size-5 text-green-500' />
								<span>{t('test.complete')}</span>
							</label>
						</div>
					</div>

					{/* Test Parameters */}
					<div className='bg-gray-50 p-4 rounded-lg'>
						<div className='flex justify-between items-center mb-4'>
							<h3 className='text-lg font-semibold flex items-center gap-2'>
								<FlaskConical className='size-5' />
								{t('test.parameters')}
							</h3>
							<div className='flex gap-2'>
								<button
									type='button'
									onClick={() => setValue('testParameters', SAMPLE_PARAMETERS)}
									className='px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm'
								>
									{t('test.sample_data')}
								</button>
								<button
									type='button'
									onClick={() =>
										append({
											key: '',
											value: 0,
											unit: '',
											referenceRange: '',
											flag: 'normal',
										})
									}
									className='px-4 py-2 bg-main text-white rounded-lg hover:bg-main/90 text-sm flex items-center gap-1'
								>
									<Plus className='size-4' />
									{t('test.add_parameter')}
								</button>
							</div>
						</div>

						<div className='space-y-4'>
							{fields.map((field, index) => (
								<div key={field.id} className='bg-white p-4 rounded-lg border'>
									<div className='grid grid-cols-1 sm:grid-cols-5 gap-4'>
										<div>
											<label className='block text-sm font-medium mb-1'>
												{t('test.parameter_name')}
											</label>
											<input
												{...register(`testParameters.${index}.key`)}
												className='w-full px-3 py-2 border border-gray-300 rounded-lg text-sm'
												placeholder='VD: glucose'
											/>
										</div>
										<div>
											<label className='block text-sm font-medium mb-1'>
												{t('test.value')}
											</label>
											<input
												type='number'
												step='0.1'
												{...register(`testParameters.${index}.value`, {
													valueAsNumber: true,
												})}
												className='w-full px-3 py-2 border border-gray-300 rounded-lg text-sm'
											/>
										</div>
										<div>
											<label className='block text-sm font-medium mb-1'>
												{t('test.unit')}
											</label>
											<input
												{...register(`testParameters.${index}.unit`)}
												className='w-full px-3 py-2 border border-gray-300 rounded-lg text-sm'
												placeholder={t('test.unit_placeholder')}
											/>
										</div>
										<div>
											<label className='block text-sm font-medium mb-1'>
												{t('test.reference_range')}
											</label>
											<input
												{...register(`testParameters.${index}.referenceRange`)}
												className='w-full px-3 py-2 border border-gray-300 rounded-lg text-sm'
												placeholder={t('test.reference_range_placeholder')}
											/>
										</div>
										<div className='flex gap-2'>
											<div className='flex-1'>
												<label className='block text-sm font-medium mb-1'>
													{t('test.status')}
												</label>
												<select
													{...register(`testParameters.${index}.flag`)}
													className='w-full px-3 py-2 border border-gray-300 rounded-lg text-sm'
												>
													<option value='normal'>{t('test.normal')}</option>
													<option value='high'>{t('test.high')}</option>
													<option value='low'>{t('test.low')}</option>
												</select>
											</div>
											<button
												type='button'
												onClick={() => remove(index)}
												className='px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 text-sm flex items-center'
											>
												<Trash2 className='size-4' />
											</button>
										</div>
									</div>
								</div>
							))}
						</div>

						{fields.length === 0 && (
							<div className='text-center py-8 text-gray-500'>
								<FlaskConical className='size-12 text-gray-300 mx-auto mb-2' />
								<p>{t('test.no_parameters')}</p>
								<button
									type='button'
									onClick={() =>
										append({
											key: '',
											value: 0,
											unit: '',
											referenceRange: '',
											flag: 'normal',
										})
									}
									className='text-main hover:text-accent mt-2'
								>
									{t('test.add_first_parameter')}
								</button>
							</div>
						)}
					</div>

					{/* Submit Button */}
					<div className='flex justify-end pt-4 border-t'>
						<button
							type='submit'
							disabled={isSubmitting || updateResult.isPending}
							className='bg-main text-white px-6 py-3 rounded-lg hover:bg-main/90 disabled:opacity-60 flex items-center gap-2'
						>
							{isSubmitting || updateResult.isPending ? (
								<>
									<LoadingIcon className='size-4' />
									{t('test.updating')}
								</>
							) : (
								<>
									<Save className='size-4' />
									{t('test.update_results')}
								</>
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}

export default TestResultEditForm
