const express = require("express");
const path = require("path");
const methodOverRide = require("method-override");
const ejsMate = require("ejs-mate");
const routesCampGround = require("./Routes/campground");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  console.log(`${new Date().toLocaleString()} ${req.method} ${req.path}`);
  next();
});
app.use(methodOverRide("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use("/", routesCampGround);

app.listen(3000, () => {
  console.log("Yup, We are listening at the port number 3000");
});
