import type {
  CommitPaymentTransactionResponseDto,
  CreatePaymentTransactionResponseDto,
} from '@retail/contracts'
import { postApi } from '../lib/http'

export async function createPaymentTransaction(
  amount: number,
  signal?: AbortSignal,
): Promise<CreatePaymentTransactionResponseDto> {
  return postApi<CreatePaymentTransactionResponseDto>(
    '/api/v1/payments/transactions',
    { amount },
    signal,
  )
}

export async function commitPaymentTransaction(
  token: string,
  signal?: AbortSignal,
): Promise<CommitPaymentTransactionResponseDto> {
  return postApi<CommitPaymentTransactionResponseDto>(
    '/api/v1/payments/transactions/commit',
    { token },
    signal,
  )
}

export function redirectToWebpay(url: string, token: string): void {
  const form = document.createElement('form')
  form.method = 'POST'
  form.action = url
  form.acceptCharset = 'UTF-8'

  const input = document.createElement('input')
  input.type = 'hidden'
  input.name = 'token_ws'
  input.value = token
  form.appendChild(input)

  document.body.appendChild(form)
  form.submit()
}
