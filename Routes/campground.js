const express = require("express");
const mongoose = require("mongoose");
const Campground = require("../models/champground");
const AppError = require("../AppError");

const Router = express.Router();

mongoose
  .connect("mongodb://127.0.0.1:27017/yelp-camp")
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
  });

Router.get("/campgrounds", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
});

Router.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});
Router.get("/campgrounds/:id", async (req, res, next) => {
  const { id } = req.params;
  if (id < 24 || id > 24) {
    return next(
      new AppError(
        401,
        "Invalid ID. The id you entered doesn't match the legacy"
      )
    );
  }

  const campground = await Campground.findById(id);
  if (!campground) {
    return next(new AppError(404, "not found"));
  }
  res.render("campgrounds/show", { campground });
});

Router.post("/campgrounds", async (req, res, next) => {
  const campground = new Campground(req.body.campground);
  await campground.save();
  if (!campground.id) {
    return next(new AppError(404, "Not Found"));
  }
  res.redirect(`campgrounds/${campground._id}`);
});

Router.get("/campgrounds/:id/edit", async (req, res) => {
  const { id } = req.params;
  if (id < 24 || id > 24) {
    return next(
      new AppError(
        401,
        "Invalid ID. The id you entered doesn't match the legacy"
      )
    );
  }
  const campground = await Campground.findById(id);
  if (!campground) {
    return next(new AppError(404, "not found"));
  }
  res.render("campgrounds/edit", { campground });
});

Router.put("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  if (id < 24 || id > 24) {
    return next(
      new AppError(
        401,
        "Invalid ID. The id you entered doesn't match the legacy"
      )
    );
  }
  const campground = await Campground.findByIdAndUpdate(
    id,
    req.body.campground,
    { new: true }
  );
  if (!campground) {
    return next(new AppError(404, "not found"));
  }
  res.render("campgrounds/show", { campground });
});

Router.delete("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  res.redirect("/campgrounds");
});
module.exports = Router;
