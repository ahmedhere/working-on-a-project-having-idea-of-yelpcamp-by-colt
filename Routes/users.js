const express = require("express");
const router = express.Router();
const controller = require("../controllers/usersControllers");
const passport = require("passport");
const { storeReturnTo } = require("../middleware/isloggedin");

router
  .route("/register")
  .get(controller.renderNewForm)
  .post(controller.newAccount);

router
  .route("/login")
  .get(controller.renderLoginPage)
  .post(
    storeReturnTo,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    controller.loginRequest
  );

router.get("/logout", controller.LogoutRequest);

module.exports = router;
