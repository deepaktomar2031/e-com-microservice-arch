import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { publishEvent } from '@src/events'
import { ExtendedError } from '@src/utils'
import { STATUS_CODES, APPLICATION_ERRORS } from '@src/constants'

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email } = req.body
    const payload = { email }

    const accessToken = jwt.sign(payload, process.env.SECRET_KEY!, {
      expiresIn: process.env.EXPIRATION_TIME! || '25m',
    })

    // Publish user signed up event
    await publishEvent('UserLoggedIn', { email })

    res.status(STATUS_CODES.OK).send({ success: true, accessToken })
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
