// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
import dotenv from 'dotenv';
dotenv.config();

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
import express from 'express'
const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
import configureApp from './config/index'
configureApp(app);

// 👇 Start handling routes here
import indexRouter from './routes/index.routes';
app.use('/', indexRouter);

import userRouter from './routes/user.routes';
app.use('/users', userRouter);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
import handleErrors from './error-handling';
handleErrors(app)

export default app
