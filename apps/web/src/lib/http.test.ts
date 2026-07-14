import { describe, expect, it } from 'vitest'
import { HttpError, getApiUrl } from './http'

describe('getApiUrl', () => {
  it('normaliza rutas con y sin barra inicial', () => {
    expect(getApiUrl('api/v1/health')).toBe(getApiUrl('/api/v1/health'))
  })
})

describe('HttpError', () => {
  it('conserva el estado HTTP', () => {
    const error = new HttpError('Servicio no disponible', 503)

    expect(error.name).toBe('HttpError')
    expect(error.status).toBe(503)
  })
})
