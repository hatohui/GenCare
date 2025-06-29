import { NextRequest, NextResponse } from 'next/server'

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const orderDetailId = params.id

		// TODO: Replace with your actual database query
		// Example with Prisma:
		// const testResult = await prisma.testResult.findUnique({
		//   where: { orderDetailId },
		//   include: { results: true }
		// })

		// For now, return mock data
		const mockTestResult = {
			type: 'general',
			data: {
				results: [
					{
						parameter: 'Huyết áp',
						value: '120/80',
						unit: 'mmHg',
						normalRange: '<140/90',
						status: 'normal',
					},
					{
						parameter: 'Nhịp tim',
						value: 72,
						unit: 'bpm',
						normalRange: '60-100',
						status: 'normal',
					},
					{
						parameter: 'Nhiệt độ',
						value: 36.8,
						unit: '°C',
						normalRange: '36.5-37.5',
						status: 'normal',
					},
					{
						parameter: 'Cân nặng',
						value: 65,
						unit: 'kg',
						normalRange: 'N/A',
						status: 'normal',
					},
					{
						parameter: 'Đường huyết',
						value: 95,
						unit: 'mg/dL',
						normalRange: '70-100',
						status: 'normal',
					},
					{
						parameter: 'Cholesterol',
						value: 180,
						unit: 'mg/dL',
						normalRange: '<200',
						status: 'normal',
					},
				],
				summary:
					'Tất cả các chỉ số đều trong giới hạn bình thường. Sức khỏe tổng thể tốt.',
				recommendations:
					'Duy trì lối sống lành mạnh, tập thể dục đều đặn 30 phút mỗi ngày, ăn uống cân bằng dinh dưỡng.',
				doctor: 'Dr. Trần Thị B',
				datePerformed: new Date().toLocaleDateString('vi-VN'),
				testId: `TEST-${orderDetailId}`,
				patientId: 'PAT-001',
				serviceId: 'SVC-001',
				labTechnician: 'Tech. Nguyễn Văn C',
				verifiedBy: 'Dr. Lê Thị D',
				verifiedAt: new Date().toISOString(),
				reportUrl: `/api/test-results/${orderDetailId}/pdf`,
			},
		}

		return NextResponse.json(mockTestResult)
	} catch (error) {
		console.error('Error fetching test result:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch test result' },
			{ status: 500 }
		)
	}
}
