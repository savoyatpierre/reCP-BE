require("dotenv").config();
const Recipe = require("../../models/Recipe.js");
const Shopping = require("../../models/Shopping.js");

module.exports = recipePick = (req, res, next) => {
	/*
	
	picks a recipe to cook and impacts the ingredient shoppings' need and done
	
	possible response types
	- recipe.pick.error
	- recipe.pick.error.onmodify
	- recipe.pick.success
	
	inputs
	- recipeid to pick specifically a given recipe
	
	*/
	
	if (process.env.DEBUG) {
	console.log("recipe.pick");
	}
	
	let matches = {
		communityid: req.augmented.user.communityid,
	}
	if (req.body.recipeids !== undefined) {
		matches.recipeid = req.body.recipeids
	} // Else random pick
	
	Recipe.aggregate(
		{ $match: matches },
		{
			$lookup: {
				from: "shoppings",
				foreignField: "shoppingid",
				localField: "ingredients.shoppingid",
				as: "shoppings",
				pipeline: [
					{
						//"shoppingid name shelfid unit need available done prices"
						$project: {
							_id: 0,
							shoppingid: 1,
							name: 1,
							shelfid: 1,
							unit: 1,
							need: 1,
							available: 1,
							done: 1,
							prices: 1,
						},
					},
				],
			},
		},
		// recipeid name portions scale ingredients instructions tocook cooked cookedlaston
		{
			$project: {
				_id: 0,
				recipeid: 1,
				name: 1,
				portions: 1,
				scale: 1,
				ingredients: 1,
				instructions: 1,
				tocook: 1,
				cooked: 1,
				cookedlaston: 1,
			},
		}
	)
	.then((recipes) => {
	
		// Seggregate recipes valid vs expired
		let expiredRecipes = []
		let stillValidRecipes = []
		let nowDate = new Date();
		recipes.forEach(recipe => {
			if (req.body.recipeid === recipe.recipeid) {
					stillValidRecipes.push(recipe)
			} else {
				if (recipe.cooked === true) {
					if (recipe.cookedlaston !== undefined) {
						let cookedDate = new Date(recipe.cookedlaston);
						if (cookedDate  < nowDate - 3 * (1000 * 3600 * 24)) {
							expiredRecipes.push(recipe)		
						} else {
							stillValidRecipes.push(recipe)						
						}
					} else {
						expiredRecipes.push(recipe)
					}
				} else {
					stillValidRecipes.push(recipe)
				}
			}
		})
		
		// Pick recipes
		let pickedRecipes = []
		if (req.body.recipeids === undefined) {
			// Pick randomly a recipe		
			let notToCookRecipe = stillValidRecipes.filte(recipe => { return recipe.tocook === false })
			pickedRecipes.push(notToCookRecipe[Math.floor(Math.random() * notToCookRecipe.length)])
		} else {
			// Pick the recipe
			stillValidRecipes.forEach(recipe => { 
				if (req.body.recipeids.includes(recipe.recipeid)) {
					pickedRecipes.push(recipe)
				}
			})
		}
		
		let recipesToSave = []
		let shoppingsToSave = {}
	
		// Manage change of picked recipes
		pickedRecipes.forEach(recipe => {
			let recipeToSave = {...recipe}
			if (recipe.tocook) {
				recipeToSave.tocook = false
				recipeToSave.scale = recipeToSave.portions
				recipeToSave.ingredients.forEach(ingredient => {
					// Add shopping to save list
					if (!Object.keys(shoppingsToSave).includes(ingredient.shoppingid)) {
						shoppingsToSave[ingredient.shoppingid] = recipeToSave.shoppings.filter(shopping => {
							return shopping.shoppingid === ingredient.shoppingid
						})[0]
					}
					// Account for change
					shoppingsToSave[ingredient.shoppingid].need = shoppingsToSave[ingredient.shoppingid].need + 
						Match.floor( 100 * ingredient.quantity * recipe.scale / recipe.portions) / 100
				})			
			} else {
				recipeToSave.tocook = true
				recipeToSave.ingredients.forEach(ingredient => {
					// Add shopping to save list
					if (!Object.keys(shoppingsToSave).includes(ingredient.shoppingid)) {
						shoppingsToSave[ingredient.shoppingid] = recipeToSave.shoppings.filter(shopping => {
							return shopping.shoppingid === ingredient.shoppingid
						})[0]
					}
					// Add to shoppings to save
					shoppingsToSave[ingredient.shoppingid].need = Math.max(shoppingsToSave[ingredient.shoppingid].need - 
						Match.floor( 100 * ingredient.quantity * recipe.scale / recipe.portions) / 100, 0)
					if (shoppingsToSave[ingredient.shoppingid].need > shoppingsToSave[ingredient.shoppingid].available) {
						shoppingsToSave[ingredient.shoppingid].done = false
					}
				})
			}
			recipesToSave.push(recipeToSave)
		})
		// Add to recipes to save
		let recipesToSend = recipesToSave.map(recipe => {
			return {
				recipeid: recipe.recipeid,
				name: recipe.name,
				portions: recipe.portions,
				scale: recipe.scale,
				ingredients: recipe.ingredients,
				instructions: recipe.instructions,
				tocook: recipe.tocook,
				cooked: recipe.cooked,
				cookedlaston: recipe.cookedlaston,
			}
		})
		
		// Manage changes of expired recipes
		expiredRecipes.forEach(recipe => {
			let recipeToSave = {...recipe}
			recipeToSave.tocook = false
			recipeToSave.cooked = false
			recipeToSave.scale = recipeToSave.portions
			// Add to recipes to save
			recipesToSave.push({
				recipeid: recipeToSave.recipeid,
				name: recipeToSave.name,
				portions: recipeToSave.portions,
				scale: recipeToSave.scale,
				ingredients: recipeToSave.ingredients,
				instructions: recipeToSave.instructions,
				tocook: recipeToSave.tocook,
				cooked: recipeToSave.cooked,
				cookedlaston: recipeToSave.cookedlaston,
			})
		})
		
		// Updates
		let outcome = {
		  recipes: { state: "pending", count: null},
		  shoppings: { state: "pending", count: null},
	  }
	  function updateObject (obj, count) {
		  outcome[obj].state = "done"
		  outcome[obj].count = count
	  }
	  function errorObject (obj, error) {
	    console.log(obj + " error", error);
		  outcome[obj].state = "error"
		  outcome[obj].count = 0
		  outcome[obj].error = error
	  }
	  let promises = []
	  if (recipesToSend.length > 0) {
		  // Update recipes		  
	    let bulkRecipes = []	  
	    recipesToSend.forEach(recipe => {
		    bulkRecipes.push({
			    updateOne: {
			      filter: { recipeid: recipe.recipeid },
			      update: recipe
			    }
			  })
	    })
		  promises.push(
			  Recipe.bulkWrite(bulkRecipes)
	      .then((recipeOutcome) => {
		      updateObject("recipes", recipeOutcome.modifiedCount)
	      })
	      .catch((error) => {
	        console.log("recipes error", error);
		      errorObject("recipes", error)
	      })
		  )
	  }
	  if (shoppingsToSave.length > 0) {
		  // Update shoppings
	    let bulkShoppings = []	  
	    shoppingsToSave.forEach(shopping => {
		    bulkShoppings.push({
			    updateOne: {
			      filter: { shoppingid: shopping.shoppingid },
			      update: shopping
			    }
			  })
	    })
		  promises.push(
			  Shopping.bulkWrite(bulkShoppings)
	      .then((shoppingOutcome) => {
		      updateObject("shoppings", shoppingOutcome.modifiedCount)
	      })
	      .catch((error) => {
	        console.log("shoppings error", error);
		      errorObject("shoppings", error)
	      })
		  )
	  }
	  // Fire promises
	  if (promises.length === 0) {
		  return res.status(200).json({
				type: "recipe.pick.success",
				recipes: [],
				more: false,
				shoppings: [],
			});	
	  } else {
		  Promise.all(promises)
		  .then(() => {
				console.log("recipe.pick.success");
				return res.status(200).json({
					type: "recipe.pick.success",
					recipes: recipesToSend,
					more: recipesToSend.length < stillValidRecipes.length ? true : false,
					shoppings: shoppingsToSave,
					outcome: outcome
				});	
			})	   
			.catch((error) => {
			  console.log("recipe.pick.error.onupdate");
			  console.error(error);
			  return res.status(400).json({
			    type: "recipe.pick.erroronupdate",
			    error: error,
			  });
			}); 
	  }				
	})
	.catch((error) => {
	  console.log("recipe.pick.error");
	  console.error(error);
	  return res.status(400).json({
	    type: "recipe.pick.error",
	    error: error,
	  });
	});
}