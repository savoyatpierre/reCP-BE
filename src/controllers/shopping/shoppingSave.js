require("dotenv").config();
//const jwt_decode = require("jwt-decode");
const Shopping = require("../../models/Shopping.js");

module.exports = shoppingSave = (req, res, next) => {
  /*
  
  saves a shopping
  
  possible response types
  * shopping.save.error.shoppingid
  * shopping.save.success.modified
  * shopping.save.error.onmodify
  
  */

  if (process.env.DEBUG) {
    console.log("shopping.save");
  }

  // Initialise
  //const authHeader = req.headers["authorization"];
  //const token = authHeader && authHeader.split(" ")[1];
  //const decodedToken = jwt_decode(token);

  // Save
  if (req.body.shoppingid === "" || req.body.shoppingid === undefined) {
    console.log("shopping.save.error.shoppingid");
    return res.status(503).json({
      type: "shopping.save.error.shoppingid",
      error: error,
    });
  } else {
    // Modify
    let shoppingToSave = { ...req.body };

    // Save
    Shopping.updateOne(
      {
        shoppingid: shoppingToSave.shoppingid,
      },
      shoppingToSave
    )
      .then(() => {
        console.log("shopping.save.success.modified");
        return res.status(200).json({
          type: "shopping.save.success.modified",
        });
      })
      .catch((error) => {
        console.log("shopping.save.error.onmodify");
        console.error(error);
        return res.status(400).json({
          type: "shopping.save.error.onmodify",
          error: error,
        });
      });
  }
};