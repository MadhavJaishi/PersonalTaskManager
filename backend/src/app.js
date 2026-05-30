import authRouter from '../routes/auth/auth.js'
import taskRouter from '../routes/taskManager/tasks.js'
import presetRouter from '../routes/taskManager/presets.js'
import timelogRouter from '../routes/taskManager/timelogs.js'
import reflectionRouter from '../routes/taskManager/reflections.js'
import quoteRouter from '../routes/quotes/quotes.js'
import credentialRouter from '../routes/passwordManager/credentials.js'
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { authMiddleware } from '../routes/middlewares/authMiddleware.js'
dotenv.config()
import cookieParser from 'cookie-parser'

const app = express()
const port = process.env.PORT || 3000

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
)
app.use(express.json())
app.use('/auth', authRouter)

// app.use(authMiddleware)
app.use('/tasks', taskRouter)
app.use('/presets', presetRouter)
app.use('/timelogs', timelogRouter)
app.use('/reflections', reflectionRouter)
app.use('/quotes', quoteRouter)
app.use('/credentials', credentialRouter)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
