import { Request, Response } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { ExtendedError, message } from '@src/utils'
import { APPLICATION_ERRORS } from '@src/constants'

export const authenticationMiddleware = async (req: Request, res: Response, next: Function) => {
  try {
    const authorizationHeader = req.headers.authorization
    if (!authorizationHeader)
      throw new ExtendedError({
        ...APPLICATION_ERRORS.UNAUTHORIZED,
        message: message.Authorization_Header_Missing,
      })

    // token check
    const token: string = authorizationHeader.split(' ')[1]
    if (!token)
      throw new ExtendedError({
        ...APPLICATION_ERRORS.UNAUTHORIZED,
        message: message.Token_Missing,
      })

    try {
      // payload check
      const payload = jwt.verify(token, process.env.SECRET_KEY!) as JwtPayload

      // token expiry check
      const now = Math.floor(Date.now() / 1000)
      if (payload.exp && payload.exp < now)
        throw new ExtendedError({
          ...APPLICATION_ERRORS.UNAUTHORIZED,
          message: message.Token_Expired,
        })

      next()
    } catch (error) {
      throw new ExtendedError({
        ...APPLICATION_ERRORS.UNAUTHORIZED,
        message: message.Invalid_Token,
      })
    }
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
