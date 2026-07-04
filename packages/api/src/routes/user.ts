import { Hono } from 'hono'
import { jwt } from 'hono/jwt'
import type { JwtVariables } from 'hono/jwt'
import { isAdmin } from '../middleware/auth.js'

type Variables = JwtVariables

export const user = new Hono<{ Variables: Variables }>()

user.use('/*', jwt({ secret: process.env.JWT_SECRET!, alg: 'HS256' }))

user.get('/me', (c) => {
  return c.json(c.get('jwtPayload'))
})

// Admin-only endpoint example
user.get('/admin', isAdmin, (c) => {
  return c.json({ message: 'Welcome admin' })
})
