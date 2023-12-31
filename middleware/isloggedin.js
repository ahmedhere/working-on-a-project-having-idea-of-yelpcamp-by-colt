const Campground = require("../models/champground");
const Review = require("../models/review");
const { campGroundSchema } = require("../Schemas.js");
const { reviewSchema } = require("../Schemas.js");
const AppError = require("../AppError");
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be logged in first");
    return res.redirect("/login");
  }

  next();
};

module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};

module.exports.validateCampground = (req, res, next) => {
  const { error } = campGroundSchema.validate(req.body);
  if (error) {
    const message = error.details.map((el) => el.message).join(",");
    throw new AppError(400, message);
  } else {
    next();
  }
};

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campFound = await Campground.findById(id);
  if (!campFound.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to edit it!");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to edit it!");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const message = error.details.map((el) => el.message).join(",");
    throw new AppError(400, message);
  } else {
    next();
  }
};
