require("dotenv").config();
const BalanceRule = require("../../models/BalanceRule.js");

module.exports = balanceruleCreate = (req, res, next) => {
  /*

create a balancerule

possible response types
- balancerule.create.success
- balancerule.create.error

*/

  if (process.env.DEBUG) {
    console.log("balancerule.create");
  }

  let balanceruleToSave = { ...req.body }
  balanceruleToSave.communityid = req.augmented.user.communityid
  balanceruleToSave = new BalanceRule(balanceruleToSave);

  // Save
  balanceruleToSave
    .save()
    .then(() => {
      console.log("balancerule.create.success");
      return res.status(201).json({
        type: "balancerule.create.success",
        data: {
          balancerule: balanceruleToSave,
        },
      });
    })
    .catch((error) => {
      console.log("balancerule.create.error");
      console.error(error);
      return res.status(400).json({
        type: "balancerule.create.error",
        error: error,
        data: {
          balanceruleid: "",
        },
      });
    });
};
