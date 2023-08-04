const express = require("express");
const { createTags, getAllTags } = require("../controller/tagsController");

const router = express.Router();

router.post("/", createTags);
router.get("/", getAllTags);

module.exports = router;
