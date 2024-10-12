import { Router } from 'express'
import { signup } from '@src/controllers'
import { requestValidatorMiddleware } from '@src/middleware'

export const routes = (router: Router) => {
  // POST /api/signup
  router.post('/api/signup', requestValidatorMiddleware, signup)
}
