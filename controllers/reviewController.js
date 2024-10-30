import catchAsync from "../utils/catchAsync.js";
import Campground from "../models/campground.js";
import Review from "../models/review.js";

export const createReview = catchAsync(async (req, res) => {
  const camp = await Campground.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  camp.reviews.push(review);
  await review.save();
  await camp.save();
  req.flash("success", "Created new review!");
  res.redirect(`/campgrounds/${camp._id}`);
});

export const deleteReview = catchAsync(async (req, res) => {
  const { id, reviewId } = req.params;
  await Review.findByIdAndDelete(reviewId);
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  req.flash("info", "The review has been deleted!");
  res.redirect(`/campgrounds/${id}`);
});
