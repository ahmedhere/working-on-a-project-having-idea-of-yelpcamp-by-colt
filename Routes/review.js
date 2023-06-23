const express = require("express");
const Campground = require("../models/champground");
const Review = require("../models/review");
const Router = express.Router({ mergeParams: true });
const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware/isloggedin");

Router.post("/", isLoggedIn, validateReview, async (req, res, next) => {
  try {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    review.author = req.user._id;
    await review.save();
    await campground.save();
    req.flash("success", "Posted a review");
    res.redirect(`/campgrounds/${campground._id}`);
  } catch (e) {
    next(e);
  }
});
Router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  async (req, res, next) => {
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
  }
);
module.exports = Router;
