import crypto from 'node:crypto'

/**
 * Webhook signature check, kept apart from lib/lemonsqueezy.ts because that one
 * is imported by a client component and this one needs node:crypto.
 *
 * Two details matter and both are easy to get wrong:
 *
 * - The HMAC is computed over the RAW body. Parsing the JSON and
 *   re-serialising it changes bytes — key order, spacing, unicode escapes —
 *   and the signature stops matching for reasons that look like a platform bug.
 * - The comparison is timing-safe. A plain === returns faster the earlier it
 *   finds a difference, which is enough to rebuild a valid signature one
 *   character at a time.
 */
export function verifyWebhookSignature(
  rawBody:   string,
  signature: string | null | undefined,
  secret:    string,
): boolean {
  if (!signature || !secret) return false

  const expected = crypto.createHmac('sha256', secret).update(rawBody, 'utf8').digest()

  let received: Buffer
  try {
    received = Buffer.from(signature, 'hex')
  } catch {
    return false
  }

  // timingSafeEqual throws when the lengths differ, and that throw is itself a
  // signal, so the length is checked first and both paths cost the same.
  if (received.length !== expected.length) return false

  return crypto.timingSafeEqual(expected, received)
}
