import express, { Application } from 'express'; //access to req.body
import morgan from 'morgan'; //logging tool
import cookieParser from "cookie-parser"; //handle cookies / authentication
import cors from 'cors'

const FRONTEND_URL = process.env.ORIGIN || "http://localhost:3000";

//middleware
const configureApp = (app: Application): void => {

  app.set('trust proxy', 1); //needed for hosting on webservice platform

  app.use(
    cors({
      origin: [FRONTEND_URL] //trusted urls inside
    })
  );

  //app logs in dev environment
  app.use(morgan('dev'));

  //access to req.body
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
};

export default configureApp
