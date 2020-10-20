import express from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import { errors } from 'celebrate'
import cors from 'cors'
import swaggerUI from 'swagger-ui-express'

const swaggerDocument = require('./docs/minha-receita-beta.json')

import routes from './routes'

dotenv.config()
const app = express()

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept-Enconding'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())

app.use(routes)
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))
app.use(errors())

export default app
