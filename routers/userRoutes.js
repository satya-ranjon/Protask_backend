const express = require("express");
const {
  userProfile,
  profileUpdate,
  passwordUpdate,
  profilePictureUpdate,
  addSleipner,
  deleteSlepiner,
  userSearch,
} = require("../controller/userController");

const router = express.Router();

// Route for user registration
router.get("/profile", userProfile);
router.patch("/update-profile", profileUpdate);
router.patch("/update-password", passwordUpdate);
router.patch("/update-profile-picture", profilePictureUpdate);
router.patch("/sleipner", addSleipner);
router.delete("/sleipner/:sleipnerId", deleteSlepiner);
router.get("/search", userSearch);

module.exports = router;
