const express = require("express");
const mongoose = require("mongoose");
const Campground = require("../models/champground");

const Router = express.Router();

mongoose
  .connect("mongodb://127.0.0.1:27017/yelp-camp")
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
  });

Router.get("/", (req, res) => {
  res.render("home");
});

Router.get("/makecampground", async (req, res) => {
  const camp = new Campground({
    title: "My Backyard",
    description: "Cheap Camping",
  });
  await camp.save();
  res.send(camp);
});

module.exports = Router;
