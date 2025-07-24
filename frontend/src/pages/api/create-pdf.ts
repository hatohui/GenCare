import type { NextApiRequest, NextApiResponse } from 'next'
import { PDFDocument, rgb } from 'pdf-lib'
import fs from 'fs'
import path from 'path'
import fontkit from '@pdf-lib/fontkit'

// Theme colors from Tailwind/app theme
const COLOR_MAIN = rgb(0.027, 0.49, 0.678) // #067dad
const COLOR_SECONDARY = rgb(0.014, 0.517, 0.455) // #038474
const COLOR_GENERAL = rgb(0.957, 0.957, 0.957) // #f4f4f4

async function embedLogo(pdfDoc: any, page: any) {
	try {
		const logoPath = path.join(
			process.cwd(),
			'public',
			'images',
			'gencarelogo.png'
		)
		const logoBytes = fs.readFileSync(logoPath)
		const pngImage = await pdfDoc.embedPng(logoBytes)
		page.drawImage(pngImage, {
			x: 40,
			y: 760,
			width: 40,
			height: 40,
		})
	} catch (e) {
		console.error('Error embedding logo:', e)
	}
}

function drawSectionTitle(page: any, font: any, text: string, y: number) {
	page.drawText(text, {
		x: 60,
		y,
		size: 16,
		font,
		color: COLOR_SECONDARY,
	})
}

function drawPatientInfoBox(page: any, font: any, lines: string[], y: number) {
	// Draw background box with more padding
	page.drawRectangle({
		x: 40,
		y: y - 20 - lines.length * 26,
		width: 520,
		height: lines.length * 26 + 32,
		color: COLOR_GENERAL,
		borderColor: COLOR_MAIN,
		borderWidth: 1.5,
		opacity: 1,
	})
	// Draw text
	lines.forEach((line, i) => {
		page.drawText(line, {
			x: 60,
			y: y - 32 - i * 26,
			size: 13,
			font,
			color: rgb(0.1, 0.2, 0.3),
		})
	})
	return y - 32 - lines.length * 26 - 10
}

function drawTable(page: any, font: any, startY: number, results: any[]) {
	const colX = [60, 180, 270, 370, 480]
	const headers = [
		'Chỉ số',
		'Giá trị',
		'Đơn vị',
		'Khoảng tham chiếu',
		'Trạng thái',
	]
	let y = startY
	// Draw headers background with main color
	page.drawRectangle({
		x: 55,
		y: y - 6,
		width: 495,
		height: 24,
		color: COLOR_MAIN,
		opacity: 0.95,
	})
	// Draw headers
	headers.forEach((header, i) => {
		page.drawText(header, {
			x: colX[i],
			y: y,
			size: 12,
			font,
			color: rgb(1, 1, 1),
		})
	})
	y -= 24
	// Draw rows
	results.forEach((row: any, idx: number) => {
		// Alternating row color
		if (idx % 2 === 1) {
			page.drawRectangle({
				x: 55,
				y: y - 4,
				width: 495,
				height: 22,
				color: COLOR_GENERAL,
			})
		}
		page.drawText(row.parameter, {
			x: colX[0],
			y,
			size: 11,
			font,
			color: rgb(0.1, 0.2, 0.3),
		})
		page.drawText(String(row.value), {
			x: colX[1],
			y,
			size: 11,
			font,
			color: rgb(0.1, 0.2, 0.3),
		})
		page.drawText(row.unit || '', {
			x: colX[2],
			y,
			size: 11,
			font,
			color: rgb(0.1, 0.2, 0.3),
		})
		page.drawText(row.referenceRange || row.normalRange || '', {
			x: colX[3],
			y,
			size: 11,
			font,
			color: rgb(0.1, 0.2, 0.3),
		})
		const flag = row.flag || row.status
		const flagText =
			flag === 'normal'
				? 'Bình thường'
				: flag === 'high'
				? 'Cao'
				: flag === 'low'
				? 'Thấp'
				: flag === 'abnormal'
				? 'Bất thường'
				: flag === 'borderline'
				? 'Giới hạn'
				: ''
		page.drawText(flagText, {
			x: colX[4],
			y,
			size: 11,
			font,
			color: rgb(0.1, 0.2, 0.3),
		})
		y -= 22
	})
	return y
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== 'POST') {
		res.setHeader('Allow', ['POST'])
		return res.status(405).json({ error: 'Method Not Allowed' })
	}

	try {
		const { booking, result } = req.body
		if (!booking) {
			return res.status(400).json({ error: 'Missing booking data' })
		}

		const pdfDoc = await PDFDocument.create()
		pdfDoc.registerFontkit(fontkit)
		const page = pdfDoc.addPage([600, 800])
		const { height } = page.getSize()

		// Load Noto Sans font
		const fontPath = path.join(
			process.cwd(),
			'public',
			'fonts',
			'NotoSans-Regular.ttf'
		)
		const fontBytes = fs.readFileSync(fontPath)
		const notoFont = await pdfDoc.embedFont(fontBytes)

		// Header with more padding
		page.drawRectangle({
			x: 0,
			y: 760,
			width: 600,
			height: 60,
			color: COLOR_MAIN,
		})
		await embedLogo(pdfDoc, page)
		page.drawText('GenCare Healthcare', {
			x: 100,
			y: 785,
			size: 24,
			font: notoFont,
			color: rgb(1, 1, 1),
		})
		page.drawText('Phiếu kết quả xét nghiệm', {
			x: 100,
			y: 765,
			size: 13,
			font: notoFont,
			color: rgb(0.85, 0.95, 1),
		})
		// Patient Info Section
		drawSectionTitle(page, notoFont, 'Thông tin bệnh nhân', height - 100)
		const infoLines = [
			`Dịch vụ: ${booking.serviceName}`,
			`Họ tên: ${booking.firstName} ${booking.lastName}`,
			`Số điện thoại: ${booking.phoneNumber}`,
			`Ngày sinh: ${
				booking.dateOfBirth
					? new Date(booking.dateOfBirth).toLocaleDateString('vi-VN')
					: ''
			}`,
			`Giới tính: ${booking.gender ? 'Nam' : 'Nữ'}`,
			`Ngày đặt: ${
				booking.createdAt
					? new Date(booking.createdAt).toLocaleDateString('vi-VN')
					: ''
			}`,
			`Trạng thái: ${booking.status ? 'Đã thanh toán' : 'Chưa thanh toán'}`,
		]
		let y = drawPatientInfoBox(page, notoFont, infoLines, height - 120)
		// Test Results Section
		if (result && result.resultData) {
			if (typeof result.resultData !== 'object') {
				return res.status(400).json({ error: 'Invalid resultData structure' })
			}
			drawSectionTitle(page, notoFont, 'Kết quả xét nghiệm', y - 20)
			y -= 40
			const results = Object.entries(result.resultData).map(
				([parameter, val]) => ({ parameter, ...(val as any) })
			)
			y = drawTable(page, notoFont, y, results)
		}
		// Footer
		page.drawLine({
			start: { x: 60, y: 60 },
			end: { x: 540, y: 60 },
			thickness: 1.5,
			color: COLOR_MAIN,
		})
		page.drawText(
			'Bảo mật - Chỉ dành cho bệnh nhân và nhân viên y tế được ủy quyền',
			{
				x: 60,
				y: 45,
				size: 10,
				font: notoFont,
				color: COLOR_SECONDARY,
			}
		)
		page.drawText('Phòng khám GenCare | www.gencare.site | 0123-456-789', {
			x: 60,
			y: 30,
			size: 10,
			font: notoFont,
			color: COLOR_SECONDARY,
		})

		// Serialize the PDFDocument to bytes (a Uint8Array)
		const pdfBytes = await pdfDoc.save()
		res.setHeader('Content-Type', 'application/pdf')
		res.setHeader('Content-Disposition', 'attachment; filename="booking.pdf"')
		res.status(200).send(Buffer.from(pdfBytes))
	} catch (error) {
		console.error('Error generating PDF:', error)
		res.status(500).json({
			error: 'Failed to generate PDF',
			details: error instanceof Error ? error.message : error,
		})
	}
}
