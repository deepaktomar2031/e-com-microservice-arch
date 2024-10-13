import { Router } from 'express'
import { order } from '@src/controllers'
import { requestValidator, authenticationMiddleware } from '@src/middleware'

export const routes = (router: Router) => {
  // POST /api/order
  router.post('/api/order', authenticationMiddleware, requestValidator, order)
}
