const Ingredient = require("../models/Ingredient");

exports.createIngredient = (req, res, next) => {
  delete req.body._id;
  const ingredient = new Ingredient({ ...req.body });
  ingredient
    .save()
    .then(() => {
      res.status(201).json({
        message: "ingrédient enregistré",
        id: ingredient._id
      });
    })
    .catch((error) => res.status(400).json({ error }));
};
exports.modifyIngredient = (req, res, next) => {
  Ingredient.updateOne(
    { _id: req.params.id },
    { ...req.body, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "ingédient modifié" }))
    .catch((error) => res.status(400).json({ error }));
};
exports.deleteIngredient = (req, res, next) => {
  Ingredient.findOne({ _id: req.params.id })
    .then((ingredient) => {
      if (!ingredient) {
        res.status(400).json({ message: "ingédient introuvable" });
      }
      Ingredient.deleteOne({ _id: req.params.id })
        .then((ingredient) =>
          res.status(200).json({ message: "ingédient supprimé" })
        )
        .catch((error) =>
          res.status(400).json({ message: "ingédient introuvable" })
        );
    })
    .catch((error) =>
      res.status(404).json({ message: "ingédient introuvable" })
    );
};
exports.findOneIngredient = (req, res, next) => {
  Ingredient.findOne({ _id: req.params.id })
    .then((ingredient) => res.status(200).json(ingredient))
    .catch((error) =>
      res.status(404).json({ message: "ingédient introuvable" })
    );
};
exports.findIngredients = (req, res, next) => {
  Ingredient.find()
    .then((ingredients) => res.status(200).json(ingredients))
    .catch((error) => res.status(400).json({ error }));
};

// LEVERAGED
exports.getIngredientItem = (req, res, next) => {
  // Initialize
  var status = 500;

  Ingredient.findOne({ _id: req.params.id })
    .then((ingredient) => {
      status = 200; // OK
      res.status(status).json({
        status: status,
        message: "ingredient ok",
        ingredient: ingredient
      });
    })
    .catch((error) => {
      status = 400; // OK
      res.status(status).json({
        status: status,
        message: "error on find",
        ingredient: {},
        error: error
      });
      console.error(error);
    });
};
exports.getIngredientList = (req, res, next) => {
  // Initialize
  var status = 500;
  var filters = {};
  var fields = "";
  var where = "";

  // Needs
  if (!req.body.need) {
    status = 403; // Access denied
  } else {
    switch (req.body.need) {
      case "ingredients":
        fields = "name unit category";
        break;
      case "recipe":
        if (req.body.details["_ids"]) {
          filters = { _id: { $in: req.body.details["_ids"] } };
        }
        break;
      case "reciperevert":
        break;
      case "thisweek":
        where = "this.state.needed > 0";
        fields = "name unit needed available";
        break;
      case "fridge":
        where = "this.state.needed > 0";
        fields = "name unit needed available";
        break;
      case "shopping":
        where =
          "this.state.needed > 0 && this.state.needed - this.state.available > 0";
        fields = "name unit needed available shopped";
        break;
      case "shopped":
        where = "this.state.needed > 0 && this.state.shopped ";
        fields = "name unit needed available shopped";
        break;
      default:
        status = 403; // Access denied
    }
  }

  if (status === 403) {
    res.status(status).json({
      status: status,
      message: "wrong need usage",
      ingredients: []
    });
  } else {
    // Find
    //https://mongoosejs.com/docs/api.html#model_Model.find
    // executes, name LIKE john and only selecting the "name" and "friends" fields
    // await MyModel.find({ name: /john/i }, 'name friends').exec();
    /*
    Ingredient.find(filters, fields)
      .$where(where)
      .exec()
      .then((ingredients) => {
        status = 200; // OK
        res.status(status).json(ingredients);
      })
      .catch((error) => {
        status = 400; // OK
        res.status(status).json([]);
      });*/

    //https://www.mongodb.com/docs/manual/reference/operator/query/where/
    /*db.players.find( {$expr: { $function: {
        body: function(name) { return hex_md5(name) == "9b53e667f30cd329dca1ec9e6a83e994"; },
        args: [ "$name" ],
        lang: "js"
  } } } )
  */
    /*
    Ingredient.find(filters, fields)
      .where(where)
      .exec(function (err, data) {
        if (err) {
          console.log(err);
          console.log("error returned");
          res.send(500, { error: "Failed insert" });
        }

        if (!data) {
          res.send(403, { error: "Authentication Failed" });
        }

        res.send(200, data);
        console.log("success generate List");
        console.log(data);
      });
      */

    Ingredient.find(filters, fields)
      .where(where)
      .then((ingredients) => {
        status = 200; // OK
        res.status(status).json({
          status: status,
          message: "list ok",
          ingredients: ingredients
        });
      })
      .catch((error) => {
        status = 400; // OK
        res.status(status).json({
          status: status,
          message: "error on find",
          ingredients: [],
          error: error
        });
        console.error(error);
      });
  }
};
exports.saveIngredient = (req, res, next) => {
  // Initialize
  var status = 500;

  if (req.body._id === "") {
    // Create
    delete req.body._id;
    const ingredient = new Ingredient({ ...req.body });
    ingredient
      .save()
      .then(() => {
        status = 201;
        res.status(status).json({
          status: status,
          message: "ingredient created",
          id: ingredient._id
        });
      })
      .catch((error) => {
        status = 400; // OK
        res.status(status).json({
          status: status,
          message: "error on create",
          error: error,
          ingredient: req.body
        });
        console.error(error);
      });
  } else {
    // Modify
    Ingredient.findByIdAndUpdate(req.body.id, ...req.body)
      .then(() => {
        status = 200;
        res.status(status).json({
          status: status,
          message: "ingredient modified",
          id: req.body.id
        });
      })
      .catch((error) => {
        status = 400; // OK
        res.status(status).json({
          status: status,
          message: "error on modify",
          error: error,
          ingredient: req.body
        });
        console.error(error);
      });
  }
};
