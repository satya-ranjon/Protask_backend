const express = require("express");
const {
  userProfile,
  profileUpdate,
  passwordUpdate,
} = require("../controller/userController");
const isAuthenticated = require("../middleware/common/authMiddleware");

const router = express.Router();

// Route for user registration
router.get("/profile", isAuthenticated, userProfile);
router.patch("/update-profile", isAuthenticated, profileUpdate);
router.patch("/update-password", isAuthenticated, passwordUpdate);

module.exports = router;
