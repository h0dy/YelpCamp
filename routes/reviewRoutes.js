import express from "express";
import { isLoggedIn, isReviewAuthor, validateReview } from "../middleware.js";
import * as reviewController from "../controllers/reviewController.js";
const router = express.Router({ mergeParams: true });

router.post("/", validateReview, isLoggedIn, reviewController.createReview);
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  reviewController.deleteReview
);

export default router;
