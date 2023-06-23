const express = require("express");
const mongoose = require("mongoose");
const Campground = require("../models/champground");
const AppError = require("../AppError");
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

Router.get("/", async (req, res, next) => {
  try {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  } catch (e) {
    next(e);
  }
});

Router.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});
Router.get("/:id", async (req, res, next) => {
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
    const campground = await Campground.findById(id)
      .populate("reviews")
      .populate("author");
    // console.log(campground);
    if (!campground) {
      req.flash("error", "cannot find the campground");
      return res.redirect("/campgrounds");
      return next(new AppError(404, "not found"));
    }

    res.render("campgrounds/show", { campground });
  } catch (e) {
    next(e);
  }
});

Router.post("/", isLoggedIn, validateCampground, async (req, res, next) => {
  try {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    if (!campground.id) {
      return next(new AppError(404, "Not Found"));
    }
    req.flash("success", "Successfully made a new campground");
    res.redirect(`campgrounds/${campground._id}`);
  } catch (e) {
    next(e);
  }
});

Router.get("/:id/edit", isLoggedIn, isAuthor, async (req, res, next) => {
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
      req.flash("error", "cannot find the campground");
      return res.redirect("/campgrounds");
      return next(new AppError(404, "not found"));
    }
    res.render("campgrounds/edit", { campground });
  } catch (e) {
    next(e);
  }
});

Router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateCampground,
  async (req, res, next) => {
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
      req.flash("success", "Successfully updated");
      res.redirect(`/campgrounds/${campground._id}`);
    } catch (e) {
      next(e);
    }
  }
);

Router.delete("/:id", isLoggedIn, isAuthor, async (req, res, next) => {
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
    req.flash("success", "Successfully deleted a campground");
    res.redirect("/campgrounds");
  } catch (e) {
    next(e);
  }
});

module.exports = Router;
