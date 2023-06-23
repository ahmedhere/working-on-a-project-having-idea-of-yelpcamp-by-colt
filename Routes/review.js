const express = require("express");
const controller = require("../controllers/reviewsController");
const Router = express.Router({ mergeParams: true });
const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware/isloggedin");

Router.post("/", isLoggedIn, validateReview, controller.NewReview);
Router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  controller.deleteReview
);
module.exports = Router;
