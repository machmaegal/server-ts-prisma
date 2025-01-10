import dotenv from 'dotenv';
import express from 'express'
import configureApp from './config/index'
import indexRouter from './routes/index.routes';
import userRouter from './routes/user.routes';
import foodRouter from './routes/foodItem.routes';
import handleErrors from './error-handling';

// access .env
dotenv.config();

// Handle http requests 
const app = express();

// middleware
configureApp(app);

// handle routes 
app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/ingredients', foodRouter)

handleErrors(app)

export default app
