const express = require("express");
const { getAllActivate } = require("../controller/activatecontroller");
const router = express.Router();

router.get("/", getAllActivate);

module.exports = router;
