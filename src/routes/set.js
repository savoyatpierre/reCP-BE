const express = require("express");
const router = express.Router();

const ingredientCtrl = require("../controllers/ingredient");
const recipeCtrl = require("../controllers/recipe");
const transactionCtrl = require("../controllers/transaction");
const categoryCtrl = require("../controllers/category");
const thisweekCtrl = require("../controllers/thisweek");

// Ingredients
router.post("/ingredient/save", ingredientCtrl.saveIngredient);
router.post("/ingredient/havehavent", ingredientCtrl.havehaventIngredient);

// Recipies
router.post("/recipe/save", recipeCtrl.saveRecipe);
router.post("/recipe/select/:id", recipeCtrl.selectRecipe);
router.post("/recipe/prepare/:id", recipeCtrl.prepareRecipe);
router.post("/recipe/delete/:id", recipeCtrl.deleteRecipe);
router.post("/recipe/replace/:id", recipeCtrl.replaceRecipe);
router.post("/recipe/scaleup/:id", recipeCtrl.scaleupRecipe);
router.post("/recipe/scaledown/:id", recipeCtrl.scaledownRecipe);

// This week
router.post("/thisweek/renew", thisweekCtrl.renewSelection);
router.post("/thisweek/empty", thisweekCtrl.emptySelection);
router.post("/thisweek/add", thisweekCtrl.addRecipe);
router.post("/thisweek/needs", thisweekCtrl.updateIngredientNeeds);

// Fridge TODO
router.post("/fridge/renew", thisweekCtrl.renewSelection);
router.post("/fridge/reset/:id", thisweekCtrl.removeRecipe);
router.post("/fridge/set/:id", thisweekCtrl.removeRecipe);

// Shop TODO
router.post("/shop/renew", thisweekCtrl.renewSelection);
router.post("/shop/reset/:id", thisweekCtrl.removeRecipe);
router.post("/shop/set/:id", thisweekCtrl.removeRecipe);

// Transactions
router.post("/transaction/save", transactionCtrl.saveTransaction);
router.post("/transaction/delete/:id", transactionCtrl.deleteTransaction);

// Categories
router.post("/category/save", categoryCtrl.saveCategory);
router.post("/category/save", categoryCtrl.deleteCategory);

module.exports = router;
