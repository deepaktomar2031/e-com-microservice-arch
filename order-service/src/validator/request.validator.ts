import { Joi } from 'express-validation'

export const RequestValidator = {
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).required(),
  body: Joi.object({
    productId: Joi.string().required(),
    quantity: Joi.number().required(),
    userId: Joi.string().required(),
  }).required(),
}
