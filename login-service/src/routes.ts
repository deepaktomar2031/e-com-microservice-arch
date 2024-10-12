import { Router } from 'express'
import { login } from '@src/controllers'
import { requestValidator, authenticationMiddleware } from '@src/middleware'

export const routes = (router: Router) => {
  // POST /api/login
  router.post('/api/login', requestValidator, authenticationMiddleware, login)
}
