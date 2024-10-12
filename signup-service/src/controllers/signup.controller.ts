import { Request, Response } from 'express'
import * as bcrypt from 'bcrypt'
import { User } from '@src/models/User'
import { publishEvent } from '@src/events'
import { ExtendedError } from '@src/utils'
import { STATUS_CODES, APPLICATION_ERRORS, SALT_VALUE } from '@src/constants'

export const signup = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      throw new ExtendedError({ ...APPLICATION_ERRORS.USER_ALREADY_EXISTS })
    }
    const hashedPassword = await bcrypt.hash(password, SALT_VALUE)
    const user = new User({ email, password: hashedPassword })
    await user.save()

    // Publish user signed up event
    await publishEvent('UserSignedUp', { email })

    res.status(STATUS_CODES.CREATED).send({ success: true, id: user._id })
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
