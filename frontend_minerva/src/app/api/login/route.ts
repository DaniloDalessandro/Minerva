// app/api/login/route.ts
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { email, password } = await req.json()

  try {
    const djangoRes = await fetch('http://127.0.0.1:8000/api/v1/accounts/token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email, // ou "username", se sua API esperar isso
        password,
      }),
    })

    const data = await djangoRes.json()

    if (!djangoRes.ok) {
      return NextResponse.json(
        { success: false, message: data.detail || 'Erro de autenticação' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      access: data.access,
      refresh: data.refresh,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { success: false, message: 'Erro interno no servidor' },
      { status: 500 }
    )
  }
}
