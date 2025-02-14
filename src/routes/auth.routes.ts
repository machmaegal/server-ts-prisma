import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../db/index'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import isAuthenticated from '../config/jwt.middleware';

const authRouter = Router()
const saltRounds = 10;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

authRouter.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    let isAdmin = false;
    if (req.body.isAdmin) {
        isAdmin = true;
    }

    if (email === '' || password === '') {
        res.status(400).json({ message: 'Provide email and password.' });
        return
    }

    if (!emailRegex.test(email)) {
        res.status(400).json({ message: 'Provide valid email address.' });
        return
    }

    try {
        const foundUser = await prisma.user.findUnique({ where: { email } });
        if (foundUser) {
            res.status(400).json({ message: 'User already exists.' });
            return
        }

        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(password, salt);
        const createdUser = await prisma.user.create({
            data: { email, password: hashedPassword, isAdmin },
        });

        const user = { email: createdUser.email };
        res.status(201).json({ user });
        return

    } catch (err) {
        console.error('Error in sign up', err);
        res.status(500).json({ message: 'Internal Server Error' });
        return
    }
});

authRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (email === '' || password === '') {
        res.status(400).json({ message: 'Provide credentials.' });
        return
    }

    try {
        const foundUser = await prisma.user.findUnique({ where: { email } });

        if (!foundUser) {
            res.status(401).json({ message: 'User not found.' });
            return
        }

        const passwordCorrect = bcrypt.compareSync(password, foundUser.password);

        if (passwordCorrect) {
            const { id, email } = foundUser;
            const payload = { id, email };
            const authToken = jwt.sign(
                payload,
                process.env.TOKEN_SECRET!,
                { algorithm: 'HS256', expiresIn: "24h" }
            );

            res.status(200).json({ authToken: authToken });
            return
        } else {
            res.status(401).json({ message: 'Unable to authenticate the user' });
            return
        }

    } catch (err) {
        console.error('Error in login', err);
        res.status(500).json({ message: 'Internal Server Error' });
        return
    }
});

authRouter.get('/verify', isAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log('req.payload', req.payload);
        res.status(200).json(req.payload);
        return
    } catch (err) {
        console.error('Error in verification', err);
        res.status(500).json({ message: 'Internal Server Error' });
        return
    }
});

authRouter.put('/update', isAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.payload?.id;
    const { email, password } = req.body;

    if (!email && !password) {
        res.status(400).json({ message: 'Provide email or password to update.' });
        return;
    }

    try {
        const foundUser = await prisma.user.findUnique({ where: { id: userId } });

        if (!foundUser) {
            res.status(404).json({ message: 'User not found.' });
            return;
        }

        const updates: { password?: string; email?: string } = {};
        let hasChanges = false;

        if (email && email !== foundUser.email) {
            if (!emailRegex.test(email)) {
                res.status(400).json({ message: 'Provide a valid email address.' });
                return;
            }

            const emailExists = await prisma.user.findUnique({ where: { email } });
            if (emailExists) {
                res.status(400).json({ message: 'Email is already in use.' });
                return;
            }

            updates.email = email;
            hasChanges = true;
        }

        if (password && !bcrypt.compareSync(password, foundUser.password)) {
            const salt = bcrypt.genSaltSync(saltRounds);
            updates.password = bcrypt.hashSync(password, salt);
            hasChanges = true;
        }

        if (!hasChanges) {
            res.status(400).json({ message: 'No changes detected.' });
            return;
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updates,
        });

        res.status(200).json({ message: 'Profile updated successfully.', user: { email: updatedUser.email } });
        return;
    } catch (err) {
        console.error('Error in updating profile', err);
        res.status(500).json({ message: 'Internal Server Error' });
        return;
    }
});

export default authRouter
