const express = require("express");
const {
  registerUser,
  loginUser,
  accountVerify,
} = require("../controller/authController");
const validateRegisterInput = require("../middleware/validateRegisterInput ");
const validateLoginInput = require("../middleware/validateLoginInput");

const router = express.Router();

// Route for user registration
router.post("/register", validateRegisterInput, registerUser);
router.post("/login", validateLoginInput, loginUser);
router.get("/verify/:token", accountVerify);

module.exports = router;
