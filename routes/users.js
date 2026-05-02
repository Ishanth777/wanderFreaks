const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {storeRedirectUrl} = require("../middleware.js");
const userControllers = require("../controllers/users.js");


//signup
router.get("/signup",userControllers.signupR);

router.post("/signup",wrapAsync(userControllers.signup));

//login

router.get
("/login",userControllers.loginR);

router.post(
       "/login",
       storeRedirectUrl,
       passport.authenticate("local", {
         failureRedirect: "/login",
         failureFlash: true
       }),
       userControllers.login
       
     );

//logout
router.get("/logout",userControllers.logout);

//display
router.get("/display",userControllers.show)

module.exports = router;