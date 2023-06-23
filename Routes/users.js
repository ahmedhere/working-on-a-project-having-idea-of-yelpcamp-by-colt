const express = require("express");
const router = express.Router();
const controller = require("../controllers/usersControllers");
const passport = require("passport");
const { storeReturnTo } = require("../middleware/isloggedin");

router.get("/register", controller.renderNewForm);

router.post("/register", controller.newAccount);

router.post(
  "/login",
  storeReturnTo,
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  controller.loginRequest
);

router.get("/login", controller.renderLoginPage);

router.get("/logout", controller.LogoutRequest);

module.exports = router;
