import authRouter from '../routes/auth/auth.js'
import taskRouter from '../routes/taskManager/tasks.js'
import timelogRouter from '../routes/taskManager/timelogs.js'
import reflectionRouter from '../routes/taskManager/reflections.js'
import quoteRouter from '../routes/quotes/quotes.js'
import credentialRouter from '../routes/passwordManager/credentials.js'
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { authMiddleware } from '../routes/middlewares/authMiddleware.js'
import cookieParser from 'cookie-parser'

dotenv.config()

const app = express()
const port = process.env.PORT || 5432

app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  }),
)
app.use(express.json())
app.use(cookieParser())

app.use('/auth', authRouter)

app.use('/tasks', authMiddleware, taskRouter)
app.use('/timelogs', authMiddleware, timelogRouter)
app.use('/reflections', authMiddleware, reflectionRouter)
app.use('/quotes', quoteRouter)
app.use('/credentials', authMiddleware, credentialRouter)

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`)
})
