const express = require("express");
const router = express.Router();

const authAuthenticate = require("../controllers/auth/authAuthenticate.js");

const shoppingCreate = require("../controllers/shopping/shoppingCreate.js");
const shoppingSave = require("../controllers/shopping/shoppingSave.js");
const shoppingDelete = require("../controllers/shopping/shoppingDelete.js");
const shoppingGetOne = require("../controllers/shopping/shoppingGetOne.js");
const shoppingGetList = require("../controllers/shopping/shoppingGetList.js");

router.post("/v1/create", authAuthenticate, shoppingCreate);
router.post("/v1/save", authAuthenticate, shoppingSave);
router.delete("/v1/:shoppingid", authAuthenticate, shoppingDelete);
router.get("/v1/:shoppingid", authAuthenticate, shoppingGetOne);
router.post("/v1/getlist", authAuthenticate, shoppingGetList);

module.exports = router;
