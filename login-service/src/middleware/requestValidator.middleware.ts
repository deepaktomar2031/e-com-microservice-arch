import { Request, Response } from 'express'
import { RequestValidator } from '@src/validator'
import { ExtendedError } from '@src/utils'
import { APPLICATION_ERRORS } from '@src/constants'

export const requestValidator = (req: Request, res: Response, next: Function) => {
  try {
    const { error } = RequestValidator.body.validate(req.body)
    if (error)
      throw new ExtendedError({ ...APPLICATION_ERRORS.BAD_REQUEST, message: error.message })

    next()
  } catch (error: unknown) {
    console.error(`error: ${error}`)

    if (error instanceof ExtendedError) {
      res.status(error.statusCode).send({ error: error.message })
    } else {
      const serverError = new ExtendedError({ ...APPLICATION_ERRORS.SERVER_ERROR })
      res.status(serverError.statusCode).send({ error: serverError.message })
    }
  }
}
