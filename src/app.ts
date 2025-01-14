import dotenv from 'dotenv';
import express from 'express'
import configureApp from './config/index'
import indexRouter from './routes/index.routes';
import authRouter from './routes/auth.routes';
import userRouter from './routes/user.routes';
import foodRouter from './routes/foodItem.routes';
import handleErrors from './error-handling';
import isAuthenticated from './config/jwt.middleware';

// access .env
dotenv.config();

// Handle http requests 
const app = express();

// middleware
configureApp(app);

// handle routes 
app.use('/', indexRouter);
app.use('/auth', authRouter)
app.use('/users', isAuthenticated, userRouter);
app.use('/ingredients', isAuthenticated, foodRouter)

handleErrors(app)

export default app
