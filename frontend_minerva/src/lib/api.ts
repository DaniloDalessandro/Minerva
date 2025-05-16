// lib/api.ts
export async function api<T = any>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    })
  
    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message || 'Erro na requisição')
    }
  
    return res.json()
  }
  