require("dotenv").config();
const Shopping = require("../../models/Shopping.js");

module.exports = shoppingCreate = (req, res, next) => {
  /*
  
  create a shopping
  
  possible response types
  * shopping.create.success
  * shopping.create.error
  
  */

  if (process.env.DEBUG) {
    console.log("shopping.create");
  }

  let shoppingToSave = { ...req.body }
  shoppingToSave.communityid = req.augmented.user.communityid
  shoppingToSave = new Shopping(shoppingToSave);

  if (shoppingToSave.available === undefined) {
    shoppingToSave.available = false;
  }

  // Save
  shoppingToSave
    .save()
    .then(() => {
      console.log("shopping.create.success");
      return res.status(201).json({
        type: "shopping.create.success",
        data: {
          shopping: shoppingToSave,
        },
      });
    })
    .catch((error) => {
      console.log("shopping.create.error");
      console.error(error);
      return res.status(400).json({
        type: "shopping.create.error",
        error: error,
        data: {
          shoppingid: "",
        },
      });
    });
};
