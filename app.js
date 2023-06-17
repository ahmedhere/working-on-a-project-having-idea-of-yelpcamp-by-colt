const express = require("express");
const path = require("path");
const methodOverRide = require("method-override");
const ejsMate = require("ejs-mate");
const fs = require("fs");
const routesCampGround = require("./Routes/campground");
const AppError = require("./AppError");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverRide("_method"));
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

app.use("/", routesCampGround);

app.use("*", (req, res) => {
  res.status(404).send("not found");
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong" } = err;
  const logerror = `${new Date().toLocaleString()} - ${req.method} - ${
    req.url
  } - ${status} - ${message} \n `;
  fs.appendFile("error.log", logerror, (error) => {
    if (error) {
      console.log("logging error");
    } else {
      console.log("error has been logged and handled");
    }
  });
  res.status(status).send(message);
});

app.listen(3000, () => {
  console.log("Yup, We are listening at the port number 3000");
});
