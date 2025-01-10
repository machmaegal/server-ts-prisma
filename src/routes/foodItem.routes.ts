import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../db/index'

const foodRouter = Router()

foodRouter.post('/', (req: Request, res: Response, next: NextFunction) => {
    const { name, calories, fat, carbs, protein } = req.body

    const newFoodItem = {
        name,
        calories,
        fat,
        carbs,
        protein
    }

    prisma.foodItem.create({ data: newFoodItem })
        .then(food => {
            console.log('new user created', food)
            res.status(201).json(food);
        })
        .catch(err => {
            console.log('Error creating foodItem', err);
            res.status(500).json({ message: 'Error creating new ingredient' });
        });
})

foodRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
    prisma.foodItem.findMany()
        .then(allIngredients => {
            res.json(allIngredients)
        })
        .catch(err => {
            console.log('Error getting foodItems from DB', err);
            res.status(500).json({ message: 'Error getting ingredient from DB' });
        })
})

foodRouter.get('/:id', (req: Request, res: Response, next: NextFunction) => {
    prisma.foodItem.findUnique({ where: { id: req.params.id } })
        .then(food => {
            if (!food) {
                res.status(404).json({ message: 'Ingredient not found' })
            } else {
                res.json(food);
            }
        })
        .catch(err => {
            console.log('Error getting foodItem from DB', err);
            res.status(500).json({ message: 'Error getting ingredient from DB' });
        })
})

foodRouter.put('/:id', (req: Request, res: Response, next: NextFunction) => {
    const { name, calories, fat, carbs, protein } = req.body

    const foodItemToUpdate = {
        name,
        calories,
        fat,
        carbs,
        protein,
    }

    prisma.foodItem.update({ where: { id: req.params.id }, data: foodItemToUpdate })
        .then(updatedFoodItem => {
            res.json(updatedFoodItem);
        })
        .catch(err => {
            console.log('Error updating a foodItem', err);
            res.status(500).json({ message: 'Error updating ingredient' });
        })
})

foodRouter.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
    prisma.foodItem.delete({ where: { id: req.params.id } })
        .then(() => {
            res.json({ messsage: 'ingredient deleted' })
        })
        .catch(err => {
            console.log('Error deleting foodItem', err)
            res.status(500).json({ message: 'Error deleting ingredient' })
        })
})

export default foodRouter
