"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_esm_1 = __importDefault(require("jsonwebtoken-esm"));
const isAuthenticated = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            throw new Error('Token not provided');
        }
        const secret = process.env.TOKEN_SECRET;
        if (!secret) {
            throw new Error('TOKEN_SECRET is not defined');
        }
        const payload = jsonwebtoken_esm_1.default.verify(token, secret);
        req.payload = payload;
        //pass the request to next middleware function or route
        next();
    }
    catch (error) {
        res.status(401).json('token not provided or invalid');
    }
};
exports.default = isAuthenticated;
