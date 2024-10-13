import { Request, Response } from 'express'
import { Order } from '@src/models/Order'
import { publishEvent } from '@src/events'
import { ExtendedError } from '@src/utils'
import { STATUS_CODES, APPLICATION_ERRORS } from '@src/constants'

export const order = async (req: Request, res: Response) => {
  try {
    const { productId, quantity, userId } = req.body

    const order = new Order({ productId, quantity, userId })
    await order.save()

    // Publish order placed event
    await publishEvent('OrderPlaced', { orderId: order._id, productId, quantity, userId })

    res.status(STATUS_CODES.ACCEPTED).send({ success: true, order })
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
