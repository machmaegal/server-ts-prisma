import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    try {

        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            throw new Error('Token not provided');
        }

        const secret = process.env.TOKEN_SECRET;
        if (!secret) {
            throw new Error('TOKEN_SECRET is not defined');
        }

        const payload = jwt.verify(token, secret);

        req.payload = payload;

        //pass the request to next middleware function or route
        next();

    } catch (error) {

        res.status(401).json('token not provided or invalid');
    }
}

export default isAuthenticated
