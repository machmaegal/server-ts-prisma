import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../db/index'

const recipeRouter = Router()

recipeRouter.post('/', (req: Request, res: Response, next: NextFunction) => {
    const { creatorId, ingredients, totalCalories } = req.body;

    const newRecipe = {
        creatorId,
        ingredients,
        totalCalories
    }

    prisma.recipe.create({ data: newRecipe })
        .then(recipe => {
            console.log('new recipe created', recipe)
            res.status(201).json(recipe);
        })
        .catch(err => {
            console.log('Error creating recipe...', err);
            res.status(500).json({ message: 'Error creating new recipe' });
        });

})

recipeRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
    const creatorId = req.query.creatorId as string;

    prisma.recipe.findMany({
        where: { creatorId: creatorId }
    })
        .then(userRecipes => {
            res.json(userRecipes);
        })
        .catch(err => {
            console.log('Error getting recipes from DB', err);
            res.status(500).json({ message: 'Error getting recipes from DB' });
        })
})

export default recipeRouter
