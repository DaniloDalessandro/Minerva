// app/api/login/route.ts
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { email, password } = await req.json()

  // Simulação de usuário real (trocar depois por banco de dados)
  if (email === 'admin@email.com' && password === '123456') {
    return NextResponse.json({
      success: true,
      token: 'fake-jwt-token',
      user: { name: 'Admin', email },
    })
  }

  return NextResponse.json(
    { success: false, message: 'Credenciais inválidas' },
    { status: 401 }
  )
}
