const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Campground = require("./models/champground");

mongoose
  .connect("mongodb://127.0.0.1:27017/yelp-camp")
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/makecampground", async (req, res) => {
  const camp = new Campground({
    title: "My Backyard",
    description: "Cheap Camping",
  });
  await camp.save();
  res.send(camp);
});

app.listen(3000, () => {
  console.log("Yup, We are listening at the port number 3000");
});
