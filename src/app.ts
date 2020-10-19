import express from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import { errors } from 'celebrate'

import routes from './routes'

dotenv.config()
const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())

app.use(routes)
app.use(errors())

export default app
