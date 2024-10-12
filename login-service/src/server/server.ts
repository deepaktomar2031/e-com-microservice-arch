// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config()
import express, { Express } from 'express'
import { connectMongo } from '@src/config/databaseConfig'
import { routes } from '@src/routes'
import { ExtendedError } from '@src/utils'
import { PORT, APPLICATION_ERRORS } from '@src/constants'

export const app: Express = express()
export const PortNum = Number(process.env.PORT!) || PORT

const listenPort = (PORT: number) => {
  app.listen(PORT, () => console.log(`Server is up & running on http://localhost:${PortNum}`))
}

const userBodyParser = () => {
  app.use(express.json())
}

const createRoutes = async () => {
  routes(app)
}

const start = async () => {
  try {
    await listenPort(PortNum)
    await connectMongo(process.env.DATABASE_URL!)
    userBodyParser()
    await createRoutes()
  } catch (error) {
    console.error(`error: ${error}`)

    throw new ExtendedError({ ...APPLICATION_ERRORS.SERVER_ERROR })
  }
}

export default {
  start,
}
