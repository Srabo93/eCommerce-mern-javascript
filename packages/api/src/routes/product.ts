import { Hono } from 'hono'

export const product = new Hono()

product.get('/', (c) => {
  return c.json({ message: 'Product list' })
})

product.get('/:id', (c) => {
  const id = c.req.param('id')
  return c.json({ message: `Product ${id}` })
})
