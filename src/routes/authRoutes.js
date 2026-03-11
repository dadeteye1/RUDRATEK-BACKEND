const express = require("express");

const { register, login } = require("../controllers/authController");
const { asyncHandler } = require("../middleware/asyncHandler");
const { validate, authSchemas } = require("../middleware/validate");

const router = express.Router();

router.post("/register", validate(authSchemas.register), asyncHandler(register));
router.post("/login", validate(authSchemas.login), asyncHandler(login));

module.exports = router;
