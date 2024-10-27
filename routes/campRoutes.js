import express from "express";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import Campground from "../models/campground.js";
import { campgroundSchema } from "../schemas.js";
import { isLoggedIn } from "../middleware.js";
const router = express.Router();

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const messageError = error.details.map((el) => el.message).join(",");
    throw new AppError(messageError, 400);
  } else {
    next();
  }
};

// read
router.get(
  "/",
  catchAsync(async (req, res) => {
    const camps = await Campground.find();
    res.render("campgrounds/index", { camps });
  })
);

// create
router.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

router.post(
  "/",
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res, next) => {
    const newCamp = await Campground.create(req.body.campground);
    req.flash("success", "Successfully made a new campground!");
    res.redirect(`/campgrounds/${newCamp._id}`);
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res, next) => {
    const camp = await Campground.findById(req.params.id).populate("reviews");
    if (!camp) {
      req.flash("error", "Cannot find that campground!");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { camp });
  })
);

// update
router.get(
  "/:id/edit",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    if (!camp) {
      req.flash("error", "Cannot find that campground!");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { camp });
  })
);
router.patch(
  "/:id",
  isLoggedIn,
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
    req.flash("update", "The campground has been updated!");
    res.redirect(`/campgrounds/${updateCamp._id}`);
  })
);

// delete
router.delete(
  "/:id",
  isLoggedIn,
  catchAsync(async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    res.redirect("/campgrounds");
  })
);

export default router;
