import express from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import routes from './routes'

dotenv.config()
const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())

app.use(routes)

export default app
