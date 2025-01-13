"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = __importDefault(require("../db/index"));
const foodRouter = (0, express_1.Router)();
foodRouter.post('/', (req, res, next) => {
    const { name, calories, fat, carbs, protein } = req.body;
    const newFoodItem = {
        name,
        calories,
        fat,
        carbs,
        protein
    };
    index_1.default.foodItem.create({ data: newFoodItem })
        .then(food => {
        console.log('new ingredient created', food);
        res.status(201).json(food);
    })
        .catch(err => {
        console.log('Error creating foodItem', err);
        res.status(500).json({ message: 'Error creating new ingredient' });
    });
});
foodRouter.post('/alot', (req, res, next) => {
    console.log(req.body);
    index_1.default.foodItem.createMany({ data: req.body, skipDuplicates: true })
        .then(food => {
        console.log('new ingredient created', food);
        res.status(201).json(food);
    })
        .catch(err => {
        console.log('Error creating foodItem', err);
        res.status(500).json({ message: 'Error creating new ingredient' });
    });
});
foodRouter.get('/', (req, res, next) => {
    index_1.default.foodItem.findMany()
        .then(allIngredients => {
        res.json(allIngredients);
    })
        .catch(err => {
        console.log('Error getting foodItems from DB', err);
        res.status(500).json({ message: 'Error getting ingredient from DB' });
    });
});
foodRouter.get('/:id', (req, res, next) => {
    index_1.default.foodItem.findUnique({ where: { id: req.params.id } })
        .then(food => {
        if (!food) {
            res.status(404).json({ message: 'Ingredient not found' });
        }
        else {
            res.json(food);
        }
    })
        .catch(err => {
        console.log('Error getting foodItem from DB', err);
        res.status(500).json({ message: 'Error getting ingredient from DB' });
    });
});
foodRouter.put('/:id', (req, res, next) => {
    const { name, calories, fat, carbs, protein } = req.body;
    const foodItemToUpdate = {
        name,
        calories,
        fat,
        carbs,
        protein,
    };
    index_1.default.foodItem.update({ where: { id: req.params.id }, data: foodItemToUpdate })
        .then(updatedFoodItem => {
        res.json(updatedFoodItem);
    })
        .catch(err => {
        console.log('Error updating a foodItem', err);
        res.status(500).json({ message: 'Error updating ingredient' });
    });
});
foodRouter.delete('/:id', (req, res, next) => {
    index_1.default.foodItem.delete({ where: { id: req.params.id } })
        .then(() => {
        res.json({ messsage: 'ingredient deleted' });
    })
        .catch(err => {
        console.log('Error deleting foodItem', err);
        res.status(500).json({ message: 'Error deleting ingredient' });
    });
});
exports.default = foodRouter;
