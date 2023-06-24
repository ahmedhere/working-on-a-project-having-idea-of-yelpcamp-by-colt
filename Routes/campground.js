const express = require("express");
const mongoose = require("mongoose");
const controller = require("../controllers/campgroudControllers");
const {
  isLoggedIn,
  validateCampground,
  isAuthor,
} = require("../middleware/isloggedin");
const multer = require("multer");
const uploads = multer({ dest: "./uploads" });

const Router = express.Router();
mongoose
  .connect("mongodb://127.0.0.1:27017/yelp-camp")
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
  });

Router.route("/")
  .get(controller.index)
  // .post(isLoggedIn, validateCampground, controller.NewCampground);
  .post(uploads.array("image"), (req, res) => {
    console.log(req.body, req.files);
    res.send("check your console");
  });

Router.get("/new", isLoggedIn, controller.renderNewForm);

Router.route("/:id")
  .get(controller.byId)
  .put(isLoggedIn, isAuthor, validateCampground, controller.UpdateEditForm)
  .delete(isLoggedIn, isAuthor, controller.deleteCampground);

Router.get("/:id/edit", isLoggedIn, isAuthor, controller.renderEditForm);

module.exports = Router;
