import express from "express";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import Campground from "../models/campground.js";
import { campgroundSchema } from "../schemas.js";
import { isLoggedIn, isOwner } from "../middleware.js";
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
    res.status(200).render("campgrounds/index", { camps });
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
    const newCamp = new Campground(req.body.campground);
    newCamp.owner = req.user._id;
    await newCamp.save();
    req.flash("success", "Successfully made a new campground!");
    res.status(201).redirect(`/campgrounds/${newCamp._id}`);
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res, next) => {
    const camp = await Campground.findById(req.params.id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("owner");
    if (!camp) {
      req.flash("error", "Cannot find that campground!");
      return res.redirect("/campgrounds");
    }
    res.status(200).render("campgrounds/show", { camp });
  })
);

// update
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
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
  isOwner,
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
    res.status(204).redirect(`/campgrounds/${updateCamp._id}`);
  })
);

// delete
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  catchAsync(async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    req.flash("info", "Your Campground successfully has been deleted!");
    res.status(204).redirect("/campgrounds");
  })
);

export default router;
