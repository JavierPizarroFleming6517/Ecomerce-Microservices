import { API_BASE_URL } from './env'

export class HttpError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'HttpError'
    this.status = status
  }
}

export function getApiUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE_URL}${normalizedPath}`
}

export async function getApi<T>(
  path: string,
  signal?: AbortSignal,
): Promise<T> {
  const response = await fetch(getApiUrl(path), {
    method: 'GET',
    headers: { Accept: 'application/json' },
    signal,
  })

  if (!response.ok) {
    throw new HttpError(
      `La API respondió con estado ${response.status}.`,
      response.status,
    )
  }

  const body = await response.text()

  if (!body) {
    return undefined as T
  }

  try {
    return JSON.parse(body) as T
  } catch {
    return body as T
  }
}
