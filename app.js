const express = require("express");
const path = require("path");
const methodOverRide = require("method-override");
const ejsMate = require("ejs-mate");
const fs = require("fs");
const routesCampGround = require("./Routes/campground");
const routeReview = require("./Routes/review");
const session = require("express-session");
const AppError = require("./AppError");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const app = express();
const User = require("./models/user");
const userRoute = require("./Routes/users");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverRide("_method"));
app.use(express.static(path.join(__dirname, "public")));
const sessionConfig = {
  secret: "Thisshouldbeabettersecret!",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  const request = `${new Date().toLocaleString()} ${req.method} ${req.url}\n`;
  fs.appendFile("request.log", request, (error) => {
    if (error) {
      console.log("Typing error");
    } else {
      console.log("request logged");
    }
  });
  next();
});
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});
// testing of the passport
// app.get("/fakeuser", async (req, res) => {
//   const user = new User({
//     email: "ahmedaries.97@gmail.com",
//     username: "ahmedaries",
//   });
//   const newUser = await User.register(user, "broishere");
//   res.send(newUser);
// });
app.use("/", userRoute);
app.use("/campgrounds", routesCampGround);
app.use("/campgrounds/:id/reviews", routeReview);

app.all("*", (req, res, next) => {
  next(new AppError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  const {
    status = 500,
    message = "Something went wrong",
    name = "no name",
  } = err;
  const logerror = `${new Date().toLocaleString()} - ${req.method} - ${
    req.url
  } - ${status} - ${message} - ${name} \n `;
  fs.appendFile("error.log", logerror, (error) => {
    if (error) {
      console.log("logging error");
    } else {
      console.log("error has been logged and handled");
    }
  });
  res.status(status).render("error", { err });
});

app.listen(3000, () => {
  console.log("Yup, We are listening at the port number 3000");
});
