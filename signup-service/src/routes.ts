import { Router } from 'express'
import { signup } from '@src/controllers'
import { requestValidator } from '@src/middleware'

export const routes = (router: Router) => {
  // POST /api/signup
  router.post('/api/signup', requestValidator, signup)
}
