import authRouter from '../routes/auth.js';
import taskRouter from '../routes/tasks.js';
import presetRouter from '../routes/presets.js';
import timelogRouter from '../routes/timelogs.js';
import reflectionRouter from '../routes/reflections.js';
import quoteRouter from '../routes/quotes.js';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express()
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/auth', authRouter);
app.use('/tasks', taskRouter);
app.use('/presets', presetRouter);
app.use('/timelogs', timelogRouter);
app.use('/reflections', reflectionRouter);
app.use('/quotes', quoteRouter)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})