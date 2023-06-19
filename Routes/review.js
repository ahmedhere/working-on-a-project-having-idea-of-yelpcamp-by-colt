const express = require("express");
const mongoose = require("mongoose");
const Campground = require("../models/champground");
const AppError = require("../AppError");
const { reviewSchema } = require("../Schemas.js");
const Review = require("../models/review");

const Router = express.Router({ mergeParams: true });

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const message = error.details.map((el) => el.message).join(",");
    throw new AppError(400, message);
  } else {
    next();
  }
};

Router.post("/", validateReview, async (req, res, next) => {
  try {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Posted a review");
    res.redirect(`/campgrounds/${campground._id}`);
  } catch (e) {
    next(e);
  }
});
Router.delete("/:reviewId", async (req, res, next) => {
  try {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId },
    });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted a review");
    res.redirect(`/campgrounds/${id}`);
  } catch (e) {
    next(e);
  }
});
module.exports = Router;
