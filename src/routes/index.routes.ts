import { Router, Request, Response, NextFunction } from 'express';

const indexRouter = Router();

indexRouter.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json("All good in here");
});

export default indexRouter
