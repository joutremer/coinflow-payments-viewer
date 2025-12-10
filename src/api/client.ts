const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'https://api-sandbox.coinflow.cash'
const API_KEY = import.meta.env.VITE_API_KEY

export interface HttpError extends Error {
  status?: number
  body?: unknown
}

async function handleResponse(response: Response) {
  if (!response.ok) {
    let body: unknown

    try {
      body = await response.json()
    } catch {
      body = await response.text()
    }

    const error: HttpError = new Error(`HTTP ${response.status}`)
    error.status = response.status
    error.body = body
    throw error
  }

  return response.json()
}

export async function get<T>(
  path: string,
  params?: Record<string, string | number | undefined>,
): Promise<T> {
  const url = new URL(path, API_BASE_URL)

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== '') {
        url.searchParams.set(key, String(value))
      }
    }
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(API_KEY ? { Authorization: API_KEY } : {}),
    },
  })

  return handleResponse(response) as Promise<T>
}

