const express = require("express");

const router = express.Router()

const SignInController = require("../controller/user.RegisterController.js");
const LoginController = require("../controller/user.LoginController.js");


router.get("/getAll", SignInController.findAll);

router.post("/signUp", SignInController.signUp);
router.post("/login", LoginController.LogIn);


router.get("/emailConfirm", LoginController.EmailConfirm);

module.exports = router;