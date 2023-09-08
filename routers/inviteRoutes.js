const express = require("express");
const router = express.Router();
const { inviteSlipner } = require("../controller/inviteController");

router.post("/invite", inviteSlipner);

module.exports = router;
