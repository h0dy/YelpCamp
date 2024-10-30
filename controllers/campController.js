import catchAsync from "../utils/catchAsync.js";
import Campground from "../models/campground.js";

export const index = catchAsync(async (req, res) => {
  const camps = await Campground.find();
  res.status(200).render("campgrounds/index", { camps });
});

export const renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};

export const createCamp = catchAsync(async (req, res, next) => {
  const newCamp = new Campground(req.body.campground);
  newCamp.owner = req.user._id;
  await newCamp.save();
  req.flash("success", "Successfully made a new campground!");
  res.status(201).redirect(`/campgrounds/${newCamp._id}`);
});

export const findOneCamp = catchAsync(async (req, res, next) => {
  const camp = await Campground.findById(req.params.id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!camp) {
    req.flash("error", "Cannot find that campground!");
    return res.redirect("/campgrounds");
  }
  res.status(200).render("campgrounds/show", { camp });
});

export const renderEditForm = catchAsync(async (req, res) => {
  const camp = await Campground.findById(req.params.id);
  if (!camp) {
    req.flash("error", "Cannot find that campground!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { camp });
});

export const updateCamp = catchAsync(async (req, res) => {
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
});

export const deleteCamp = catchAsync(async (req, res) => {
  await Campground.findByIdAndDelete(req.params.id);
  req.flash("info", "Your Campground successfully has been deleted!");
  res.status(204).redirect("/campgrounds");
});
