import express from 'express'
import { config } from 'dotenv'
import morgan from 'morgan'
import appRouter from './routes/index.js'
import { cookie } from 'express-validator'
import cookieParser from 'cookie-parser'
import cors from 'cors'

config()
const app = express()

// middlewares
app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true
}))
app.use(express.json())
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(morgan("dev"))  // remove it during production this package is just to log 
app.use("/api/v1", appRouter)


export default app;