import Campground from "./models/campground.js";
import Review from "./models/review.js";

export const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signed in!");
    return res.status(401).redirect("/login");
  }
  next();
};

export const storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};
export const isOwner = async (req, res, next) => {
  const camp = await Campground.findById(req.params.id);
  if (!camp.owner.equals(req.user._id)) {
    req.flash("error", "You don't have permission!");
    return res.status(403).redirect(`/campgrounds/${camp._id}`);
  }
  next();
};
export const isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  console.log(review);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You don't have permission!");
    return res.status(403).redirect(`/campgrounds/${id}`);
  }
  next();
};
/*
We store req.originalUrl in req.session.returnTo instead of directly in res.locals because res.locals is only accessible during the lifetime of the current request-response cycle. The session (req.session) persists across multiple requests and is not cleared until the user logs out or the session expires. This allows us to retain the returnTo URL across the redirect to the login page and use it after the user has logged in.

By transferring req.session.returnTo to res.locals just before passport.authenticate() is executed, we ensure that the URL is preserved even though the session is cleared after authentication by the passport.authenticate() method (in that final single login request-response cycle when the actual authentication happens).
 */
