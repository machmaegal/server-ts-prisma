"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = __importDefault(require("../db/index"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_esm_1 = __importDefault(require("jsonwebtoken-esm"));
const jwt_middleware_1 = __importDefault(require("../config/jwt.middleware"));
const authRouter = (0, express_1.Router)();
const saltRounds = 10;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
authRouter.post('/signup', (req, res, next) => {
    const { email, password } = req.body;
    let isAdmin = false;
    if (req.body.isAdmin)
        isAdmin = req.body;
    if (email === '' || password === '') {
        res.status(400).json({ message: 'Provide email and password.' });
        return;
    }
    if (!emailRegex.test(email)) {
        res.status(400).json({ message: 'Provide valid email address.' });
        return;
    }
    index_1.default.user.findUnique({ where: { email: req.body.email } })
        .then((foundUser) => {
        if (foundUser) {
            res.status(400).json({ message: 'User already exists.' });
            return;
        }
        const salt = bcryptjs_1.default.genSaltSync(saltRounds);
        const hashedPassword = bcryptjs_1.default.hashSync(password, salt);
        //return pending promise to omit password and isAdmin in response of next .then call
        return index_1.default.user.create({ data: { email, password: hashedPassword, isAdmin } });
    })
        .then((createdUser) => {
        const { email } = createdUser;
        const user = { email };
        res.status(201).json({ user: user });
    })
        .catch(err => {
        console.log('Error in sign up', err);
        res.status(500).json({ message: 'Internal Server Error' });
    });
});
authRouter.post('/login', (req, res, next) => {
    const { email, password } = req.body;
    if (email === '' || password === '') {
        res.status(400).json({ message: 'Provide credentials.' });
        return;
    }
    index_1.default.user.findUnique({ where: { email: req.body.email } })
        .then((foundUser) => {
        if (!foundUser) {
            res.status(401).json({ message: 'User not found.' });
            return;
        }
        const passwordCorrect = bcryptjs_1.default.compareSync(password, foundUser.password);
        if (passwordCorrect) {
            const { id, email } = foundUser;
            const payload = { id, email };
            const authToken = jsonwebtoken_esm_1.default.sign(payload, process.env.TOKEN_SECRET, { algorithm: 'HS256', expiresIn: "24h" });
            res.status(200).json({ authToken: authToken });
        }
        else {
            res.status(401).json({ message: 'Unable to authenticate the user' });
        }
    })
        .catch(err => {
        console.log('Error in login', err);
        res.status(500).json({ message: 'Internal Server Error' });
    });
});
authRouter.get('/verify', jwt_middleware_1.default, (req, res, next) => {
    console.log(`req.payload`, req.payload);
    res.status(200).json(req.payload);
});
exports.default = authRouter;
