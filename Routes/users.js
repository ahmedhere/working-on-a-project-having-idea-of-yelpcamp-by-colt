const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const { storeReturnTo } = require("../middleware/isloggedin");

router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post("/register", async (req, res, next) => {
  try {
    const { username, password, email } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) next(err);
      req.flash("success", "Welcome to Yelp Champ");
      res.redirect("/campgrounds");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("register");
  }
});

router.post(
  "/login",
  storeReturnTo,
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.flash("success", "Welcome back");
    const redirectURL = res.locals.returnTo || "/campgrounds";
    res.redirect(redirectURL);
  }
);

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    } else {
      req.flash(
        "Success",
        "Goodbye!!! You have been successfully logged out!!"
      );
      res.redirect("/campgrounds");
    }
  });
});

module.exports = router;
