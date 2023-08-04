const express = require("express");
const {
  registerUser,
  loginUser,
  userProfile,
  profileUpdate,
  passwordUpdate,
} = require("../controller/userController");
const validateRegisterInput = require("../middleware/validateRegisterInput ");
const validateLoginInput = require("../middleware/validateLoginInput");
const isAuthenticated = require("../middleware/common/authMiddleware");

const router = express.Router();

// Route for user registration
router.post("/register", validateRegisterInput, registerUser);
router.post("/login", validateLoginInput, loginUser);
router.get("/profile", isAuthenticated, userProfile);
router.patch("/update-profile", isAuthenticated, profileUpdate);
router.patch("/update-password", isAuthenticated, passwordUpdate);

module.exports = router;
