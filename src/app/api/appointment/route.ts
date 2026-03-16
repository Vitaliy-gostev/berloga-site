import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, phone, email, service, comment } = body

    if (!name?.trim() || !phone?.trim()) {
      return NextResponse.json({ error: 'Имя и телефон обязательны' }, { status: 400 })
    }

    // TODO: send to Telegram bot, email, or save to DB
    console.log('New appointment:', { name, phone, email, service, comment, date: new Date().toISOString() })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
