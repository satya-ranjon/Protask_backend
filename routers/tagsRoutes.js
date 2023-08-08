const express = require("express");
const {
  createTags,
  deleteTag,
  getAllTags,
} = require("../controller/tagsController");

const router = express.Router();

router.patch("/", createTags);
router.delete("/:tagId", deleteTag);
router.get("/", getAllTags);

module.exports = router;
