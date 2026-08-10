import { API_BASE_URL } from './env'

export class HttpError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'HttpError'
    this.status = status
  }
}

export interface ApiRequestOptions {
  signal?: AbortSignal
  accessToken?: string | null
  headers?: Record<string, string>
}

export function getApiUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE_URL}${normalizedPath}`
}

function buildHeaders(
  options?: ApiRequestOptions,
  includeJsonBody = false,
): HeadersInit {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(includeJsonBody ? { 'Content-Type': 'application/json' } : {}),
    ...options?.headers,
  }

  if (options?.accessToken) {
    headers.Authorization = `Bearer ${options.accessToken}`
  }

  return headers
}

async function parseResponse<T>(response: Response): Promise<T> {
  const body = await response.text()

  if (!response.ok) {
    let message = `La API respondió con estado ${response.status}.`

    if (body) {
      try {
        const parsed = JSON.parse(body) as { message?: string | string[] }
        if (typeof parsed.message === 'string') {
          message = parsed.message
        } else if (Array.isArray(parsed.message)) {
          message = parsed.message.join(', ')
        }
      } catch {
        // keep default message
      }
    }

    throw new HttpError(message, response.status)
  }

  if (!body) {
    return undefined as T
  }

  try {
    return JSON.parse(body) as T
  } catch {
    return body as T
  }
}

export async function getApi<T>(
  path: string,
  signalOrOptions?: AbortSignal | ApiRequestOptions,
): Promise<T> {
  const options =
    signalOrOptions instanceof AbortSignal
      ? { signal: signalOrOptions }
      : signalOrOptions

  const response = await fetch(getApiUrl(path), {
    method: 'GET',
    headers: buildHeaders(options),
    signal: options?.signal,
  })

  return parseResponse<T>(response)
}

export async function postApi<T>(
  path: string,
  data?: unknown,
  signalOrOptions?: AbortSignal | ApiRequestOptions,
): Promise<T> {
  const options =
    signalOrOptions instanceof AbortSignal
      ? { signal: signalOrOptions }
      : signalOrOptions

  const response = await fetch(getApiUrl(path), {
    method: 'POST',
    headers: buildHeaders(options, true),
    body: data === undefined ? undefined : JSON.stringify(data),
    signal: options?.signal,
  })

  return parseResponse<T>(response)
}
