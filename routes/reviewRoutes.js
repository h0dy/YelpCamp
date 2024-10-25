import express from "express";
import { reviewSchema } from "../schemas.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import Campground from "../models/campground.js";
import Review from "../models/review.js";
const router = express.Router({ mergeParams: true });

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const messageError = error.details.map((el) => el.message).join(",");
    throw new AppError(messageError, 400);
  } else {
    next();
  }
};

router.post(
  "/",
  validateReview,
  catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    const review = await Review.create(req.body.review);
    camp.reviews.push(review);
    await camp.save();
    req.flash("success", "Created new review!")
    res.redirect(`/campgrounds/${camp._id}`);
  })
);
router.delete(
  "/:reviewId",
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    req.flash("info", "The review has been deleted!")
    res.redirect(`/campgrounds/${id}`);
  })
);

export default router;
