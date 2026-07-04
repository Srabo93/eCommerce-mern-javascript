import { Hono } from 'hono'
import { jwt } from 'hono/jwt'
import type { JwtVariables } from 'hono/jwt'
import { isAdmin } from '../middleware/auth.js'

type Variables = JwtVariables

export const order = new Hono<{ Variables: Variables }>()

order.use('/*', jwt({ secret: process.env.JWT_SECRET!, alg: 'HS256' }))

order.get('/', (c) => {
  const user = c.get('jwtPayload')
  return c.json({ message: `Orders for user ${user.id}` })
})

// Admin: list all orders
order.get('/all', isAdmin, (c) => {
  return c.json({ message: 'All orders (admin)' })
})
