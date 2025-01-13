export { };

declare global {
    namespace Express {
        interface Request {
            payload?: string | jwt.JwtPayload;
        }
    }
}