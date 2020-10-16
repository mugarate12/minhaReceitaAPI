import express from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'

dotenv.config()
const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())

export default app
