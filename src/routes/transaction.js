const express = require("express");
const router = express.Router();

const authAuthenticate = require("../controllers/auth/authAuthenticate.js");

const transactionCreate = require("../controllers/transaction/transactionCreate.js");
const transactionSave = require("../controllers/transaction/transactionSave.js");
const transactionDelete = require("../controllers/transaction/transactionDelete.js");
const transactionGetOne = require("../controllers/transaction/transactionGetOne.js");
const transactionGetList = require("../controllers/transaction/transactionGetList.js");

router.post(
    "/v1/create",
    authAuthenticate,
    transactionCreate,
);
router.post(
    "/v1/save",
    authAuthenticate,
    transactionSave,
);
router.post(
    "/v1/delete",
    authAuthenticate,
    transactionDelete
);
router.post(
    "/v1/getone",
    authAuthenticate,
    transactionGetOne
);
router.post(
    "/v1/getlist",
    authAuthenticate,
    transactionGetList
);

module.exports = router;