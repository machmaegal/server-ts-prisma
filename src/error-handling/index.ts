import { Application, Request, Response, NextFunction } from 'express';

const handleErrors = (app: Application) => {
  app.use((req: Request, res: Response, next: NextFunction) => {

    res.status(404).json({ message: "This route does not exist" });
  });

  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    // handle next(err) calls

    console.error("ERROR", req.method, req.path, err);

    // only render if error ocurred before sending response
    if (!res.headersSent) {
      res
        .status(500)
        .json({
          message: "Internal server error. Check the server console",
        });
    }
  });
};

export default handleErrors
