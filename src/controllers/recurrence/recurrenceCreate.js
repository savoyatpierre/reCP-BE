require("dotenv").config();
//const jwt_decode = require("jwt-decode");
const Recurrence = require("../../models/Recurrence.js");

module.exports = recurrenceCreate = (req, res, next) => {
  /*
  
  create a recurrence
  
  possible response types
  * recurrence.create.success
  * recurrence.create.error
  
  TODO
  * only users from the table can do this
  
  */

  if (process.env.DEBUG) {
    console.log("recurrence.create");
  }

  // Initialise
  //const authHeader = req.headers["authorization"];
  //const token = authHeader && authHeader.split(" ")[1];
  //const decodedToken = jwt_decode(token);

  const recurrenceToSave = new Recurrence({ ...req.body });

  // Save
  recurrenceToSave
    .save()
    .then(() => {
      console.log("recurrence.create.success");
      return res.status(201).json({
        type: "recurrence.create.success",
        data: {
          recurrence: recurrenceToSave,
        },
      });
    })
    .catch((error) => {
      console.log("recurrence.create.error");
      console.error(error);
      return res.status(400).json({
        type: "recurrence.create.error",
        error: error,
        data: {
          recurrenceid: "",
        },
      });
    });
};