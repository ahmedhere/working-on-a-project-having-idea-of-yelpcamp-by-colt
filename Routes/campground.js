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

Router.get("/campgrounds", async (req, res, next) => {
  try {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  } catch (e) {
    next(e);
  }
});

Router.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});
Router.get("/campgrounds/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id.length < 24 || id.length > 24) {
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
  } catch (e) {
    next(e);
  }
});

Router.post("/campgrounds", async (req, res, next) => {
  try {
    if (!req.body.campground) {
      throw new AppError(400, "Invalid campground data");
    }
    const campground = new Campground(req.body.campground);
    await campground.save();
    if (!campground.id) {
      return next(new AppError(404, "Not Found"));
    }
    res.redirect(`campgrounds/${campground._id}`);
  } catch (e) {
    next(e);
  }
});

Router.get("/campgrounds/:id/edit", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id.length < 24 || id.length > 24) {
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
  } catch (e) {
    next(e);
  }
});

Router.put("/campgrounds/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id.length < 24 || id.length > 24) {
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
  } catch (e) {
    next(e);
  }
});

Router.delete("/campgrounds/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id.length < 24 || id.length > 24) {
      return next(
        new AppError(
          401,
          "Invalid ID. The id you entered doesn't match the legacy"
        )
      );
    }
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
  } catch (e) {
    next(e);
  }
});
module.exports = Router;
