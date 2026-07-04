import { Hono } from 'hono'
import { sign } from 'hono/jwt'

export const auth = new Hono()

auth.post('/login', async (c) => {
  const { email, password } = await c.req.json<{ email: string; password: string }>()

  // TODO: validate credentials against DB (reference: legacy/backend/controllers/userController.js)
  const payload = {
    id: 'placeholder-user-id',
    email,
    isAdmin: false,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 10, // 10 days
  }

  const token = await sign(payload, process.env.JWT_SECRET!)
  return c.json({ token, user: payload })
})
