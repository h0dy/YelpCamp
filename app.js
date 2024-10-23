import express from "express";
import mongoose from "mongoose";
import Campground from "./models/campground.js";
import Review from "./models/review.js";
import methodOverride from "method-override";
import morgan from "morgan";
import ejsMate from "ejs-mate";
import catchAsync from "./utils/catchAsync.js";
import AppError from "./utils/appError.js";
import Joi from "joi";
import { campgroundSchema, reviewSchema } from "./schemas.js";
import campground from "./models/campground.js";
const app = express();

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/yelp-camp");
    console.log("MongoDB Connected");
  } catch (err) {
    console.log("Error with connection to DB", err);
  }
};

// middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const messageError = error.details.map((el) => el.message).join(",");
    throw new AppError(messageError, 400);
  } else {
    next();
  }
};

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const messageError = error.details.map((el) => el.message).join(",");
    throw new AppError(messageError, 400);
  } else {
    next();
  }
};

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views");

// read
app.get("/", (req, res) => {
  res.render("home");
});
app.get(
  "/campgrounds",
  catchAsync(async (req, res) => {
    const camps = await Campground.find();
    res.render("campgrounds/index", { camps });
  })
);

// create
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});
app.post(
  "/campgrounds",
  validateCampground,
  catchAsync(async (req, res, next) => {
    const newCamp = await Campground.create(req.body.campground);
    res.redirect(`/campgrounds/${newCamp._id}`);
  })
);

app.get(
  "/campgrounds/:id",
  catchAsync(async (req, res, next) => {
    const camp = await Campground.findById(req.params.id).populate("reviews");
    res.render("campgrounds/show", { camp });
  })
);

// update
app.get(
  "/campgrounds/:id/edit",
  catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { camp });
  })
);
app.patch(
  "/campgrounds/:id",
  validateCampground,
  catchAsync(async (req, res) => {
    const updateCamp = await Campground.findByIdAndUpdate(
      req.params.id,
      { ...req.body.campground },
      {
        new: true,
        runValidators: true,
      }
    );
    res.redirect(`/campgrounds/${updateCamp._id}`);
  })
);

// delete
app.delete(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    res.redirect("/campgrounds");
  })
);

app.post(
  "/campgrounds/:id/reviews",
  validateReview,
  catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    const review = await Review.create(req.body.review);
    camp.reviews.push(review);
    await camp.save();
    res.redirect(`/campgrounds/${camp._id}`);
  })
);
app.delete(
  "/campgrounds/:id/reviews/:reviewId",
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    res.redirect(`/campgrounds/${id}`);
  })
);

app.all(/(.*)/, (req, res, next) => {
  next(new AppError("404 – Page not found", 404));
});
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "something went wrong!" } = err;
  if (!err.message) err.message = "something went wrong!";
  res.status(statusCode).render("error", { err });
});

app.listen(8080, () => {
  connectDB();
  console.log("Serving on port 8080");
});
