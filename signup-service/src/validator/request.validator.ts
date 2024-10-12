import { Joi } from 'express-validation'

export const RequestValidator = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }).required(),
}
