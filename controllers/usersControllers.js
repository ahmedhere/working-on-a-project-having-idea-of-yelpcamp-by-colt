const User = require("../models/user");

module.exports.renderNewForm = (req, res) => {
  res.render("users/register");
};

module.exports.newAccount = async (req, res, next) => {
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
};

module.exports.loginRequest = (req, res) => {
  req.flash("success", "Welcome back");
  const redirectURL = res.locals.returnTo || "/campgrounds";
  res.redirect(redirectURL);
};

module.exports.renderLoginPage = (req, res) => {
  res.render("users/login");
};

module.exports.LogoutRequest = (req, res) => {
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
};
