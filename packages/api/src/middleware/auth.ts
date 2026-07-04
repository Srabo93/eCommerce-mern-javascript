import type { MiddlewareHandler } from 'hono'

export const isAdmin: MiddlewareHandler = async (c, next) => {
  const payload = c.get('jwtPayload') as { isAdmin?: boolean } | undefined
  if (!payload?.isAdmin) {
    return c.json({ message: 'Not authorized, admin only' }, 401)
  }
  await next()
}
