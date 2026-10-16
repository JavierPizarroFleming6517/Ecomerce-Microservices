import { Writable } from 'node:stream'

const LEVELS: Record<number, string> = {
  10: 'trace',
  20: 'debug',
  30: 'info',
  40: 'warn',
  50: 'error',
  60: 'fatal',
}

export function createRailwayLogStream(): Writable {
  let buffer = ''

  return new Writable({
    write(chunk, _encoding, callback) {
      buffer += chunk.toString()
      const lines = buffer.split('\n')
      buffer = lines.pop() ?? ''

      for (const line of lines) {
        const trimmed = line.trim()
        if (trimmed) {
          process.stdout.write(`${formatRailwayLog(trimmed)}\n`)
        }
      }

      callback()
    },
  })
}

function formatRailwayLog(line: string): string {
  try {
    return formatRecord(JSON.parse(line) as Record<string, unknown>)
  } catch {
    return line
  }
}

function formatRecord(log: Record<string, unknown>): string {
  const service = text(log.service) ?? 'service'
  const level = LEVELS[typeof log.level === 'number' ? log.level : 30] ?? 'info'
  const req = record(log.req)
  const res = record(log.res)
  const method = req ? text(req.method) : undefined
  const endpoint = req ? endpointOf(req.url) : undefined
  const status =
    res && typeof res.statusCode === 'number' ? String(res.statusCode) : undefined

  if (method && endpoint && status) {
    const failure = Number(status) >= 400 ? errorText(log.err) : undefined
    return [service, level, method, endpoint, status, failure]
      .filter(Boolean)
      .join(' ')
  }

  const context = text(log.context)
  const message = firstLine(text(log.msg) ?? errorText(log.err) ?? '')
  return [service, level, context, message].filter(Boolean).join(' ')
}

function endpointOf(value: unknown): string | undefined {
  const url = text(value)
  if (!url) {
    return undefined
  }

  const queryIndex = url.indexOf('?')
  return queryIndex === -1 ? url : url.slice(0, queryIndex)
}

function errorText(value: unknown): string | undefined {
  const err = record(value)
  return firstLine(err ? text(err.message) ?? '' : '')
}

function firstLine(value: string): string | undefined {
  const line = value.split('\n')[0]?.trim()
  if (!line) {
    return undefined
  }

  return line.length > 180 ? `${line.slice(0, 177)}...` : line
}

function text(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value : undefined
}

function record(value: unknown): Record<string, unknown> | undefined {
  return value !== null && typeof value === 'object'
    ? (value as Record<string, unknown>)
    : undefined
}
