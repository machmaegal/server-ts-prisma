"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = __importDefault(require("../db/index"));
const userRouter = (0, express_1.Router)();
userRouter.post('/', (req, res, next) => {
    const { email, password, isAdmin } = req.body;
    const newUser = {
        email,
        password,
        isAdmin
    };
    index_1.default.user.create({ data: newUser })
        .then(user => {
        console.log('new user created', user);
        res.status(201).json(user);
    })
        .catch(err => {
        console.log('Something went wrong...', err);
        res.status(500).json({ message: 'Error creating new user' });
    });
});
userRouter.get('/', (req, res, next) => {
    index_1.default.user.findMany()
        .then(allUsers => {
        res.json(allUsers);
    })
        .catch(err => {
        console.log('Error getting users from DB', err);
        res.status(500).json({ message: 'Error getting users from DB' });
    });
});
userRouter.get('/:userId', (req, res, next) => {
    index_1.default.user.findUnique({ where: { id: req.params.userId } })
        .then(user => {
        if (!user) {
            res.status(404).json({ message: 'User not found' });
        }
        else {
            res.json(user);
        }
    })
        .catch(err => {
        console.log('Error getting user from DB', err);
        res.status(500).json({ message: 'Error getting user from DB' });
    });
});
userRouter.put('/:userId', (req, res, next) => {
    const { email, password, isAdmin } = req.body;
    const userToUpdate = {
        email,
        password,
        isAdmin
    };
    index_1.default.user.update({ where: { id: req.params.userId }, data: userToUpdate })
        .then(updatedUser => {
        res.json(updatedUser);
    })
        .catch(err => {
        console.log('Error updating a user', err);
        res.status(500).json({ message: 'Error updating a user' });
    });
});
userRouter.delete('/:userId', (req, res, next) => {
    index_1.default.user.delete({ where: { id: req.params.userId } })
        .then(() => {
        res.json({ messsage: 'user deleted' });
    })
        .catch(err => {
        console.log('Error deleting user', err);
        res.status(500).json({ message: 'Error deleting user' });
    });
});
exports.default = userRouter;
