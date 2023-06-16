const express = require("express");
const path = require("path");
const methodOverRide = require("method-override");
const routesCampGround = require("./Routes/campground");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverRide("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/", routesCampGround);

app.listen(3000, () => {
  console.log("Yup, We are listening at the port number 3000");
});
