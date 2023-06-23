const express = require("express");
const mongoose = require("mongoose");
const controller = require("../controllers/campgroudControllers");
const {
  isLoggedIn,
  validateCampground,
  isAuthor,
} = require("../middleware/isloggedin");

const Router = express.Router();
mongoose
  .connect("mongodb://127.0.0.1:27017/yelp-camp")
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
  });

Router.get("/", controller.index);
Router.get("/new", isLoggedIn, controller.renderNewForm);
Router.get("/:id", controller.byId);
Router.get("/:id/edit", isLoggedIn, isAuthor, controller.renderEditForm);

Router.post("/", isLoggedIn, validateCampground, controller.NewCampground);

Router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateCampground,
  controller.UpdateEditForm
);

Router.delete("/:id", isLoggedIn, isAuthor, controller.deleteCampground);

module.exports = Router;
