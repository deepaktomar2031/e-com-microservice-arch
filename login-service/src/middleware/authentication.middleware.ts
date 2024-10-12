import { Request, Response } from 'express'
import * as bcrypt from 'bcrypt'
import { User } from '@src/models/User'
import { ExtendedError } from '@src/utils'
import { APPLICATION_ERRORS } from '@src/constants'

export const authenticationMiddleware = async (req: Request, res: Response, next: Function) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (!user) {
      throw new ExtendedError({ ...APPLICATION_ERRORS.UNAUTHORIZED })
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password)

    if (!isPasswordMatch) {
      throw new ExtendedError({ ...APPLICATION_ERRORS.UNAUTHORIZED })
    }

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
