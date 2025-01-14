import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../db/index'

const userRouter = Router()

userRouter.post('/', (req: Request, res: Response, next: NextFunction) => {
    const { email, password, isAdmin } = req.body

    const newUser = {
        email,
        password,
        isAdmin
    }

    prisma.user.create({ data: newUser })
        .then(user => {
            console.log('new user created', user)
            res.status(201).json(user);
        })
        .catch(err => {
            console.log('Something went wrong...', err);
            res.status(500).json({ message: 'Error creating new user' });
        });

})

userRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
    prisma.user.findMany()
        .then(allUsers => {
            res.json(allUsers)
        })
        .catch(err => {
            console.log('Error getting users from DB', err);
            res.status(500).json({ message: 'Error getting users from DB' });
        })
})

userRouter.get('/:userId', (req: Request, res: Response, next: NextFunction) => {
    prisma.user.findUnique({ where: { id: req.params.userId } })
        .then(user => {
            if (!user) {
                res.status(404).json({ message: 'User not found' })
            } else {
                res.json(user);
            }
        })
        .catch(err => {
            console.log('Error getting user from DB', err);
            res.status(500).json({ message: 'Error getting user from DB' });
        })
})

userRouter.get('/:email', (req: Request, res: Response, next: NextFunction) => {
    prisma.user.findUnique({ where: { email: req.params.email } })
        .then(user => {
            if (!user) {
                res.status(404).json({ message: 'User not found' });
            } else {
                res.json(user);
            }
        })
        .catch(err => {
            console.error('Error getting user from DB', err);
            res.status(500).json({ message: 'Error getting user from DB' });
        });
});


userRouter.put('/:userId', (req: Request, res: Response, next: NextFunction) => {

    const { email, password, isAdmin } = req.body

    const userToUpdate = {
        email,
        password,
        isAdmin
    }

    prisma.user.update({ where: { id: req.params.userId }, data: userToUpdate })
        .then(updatedUser => {
            res.json(updatedUser);
        })
        .catch(err => {
            console.log('Error updating a user', err);
            res.status(500).json({ message: 'Error updating a user' });
        })
})

userRouter.delete('/:userId', (req: Request, res: Response, next: NextFunction) => {
    prisma.user.delete({ where: { id: req.params.userId } })
        .then(() => {
            res.json({ messsage: 'user deleted' })
        })
        .catch(err => {
            console.log('Error deleting user', err)
            res.status(500).json({ message: 'Error deleting user' })
        })
})

export default userRouter