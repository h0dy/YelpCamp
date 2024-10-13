import express from "express";
import mongoose from "mongoose";
import Campground from "./models/campground.js";
import methodOverride from "method-override";
const app = express();

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/yelp-camp");
    console.log("MongoDB Connected");
  } catch (err) {
    console.log("Error with connection to DB", err);
  }
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.set("views");

// read
app.get("/", (req, res) => {
  res.render("home");
});
app.get("/campgrounds", async (req, res) => {
  const camps = await Campground.find();
  res.render("campgrounds/index", { camps });
});

// create
app.get("/campgrounds/new", async (req, res) => {
  res.render("campgrounds/new");
});
app.post("/campgrounds", async (req, res) => {
  const newCamp = await Campground.create(req.body.campground);
  res.redirect(`/campgrounds/${newCamp._id}`);
});

app.get("/campgrounds/:id", async (req, res) => {
  const camp = await Campground.findById(req.params.id);
  res.render("campgrounds/show", { camp });
});

// update
app.get("/campgrounds/:id/edit", async (req, res) => {
  const camp = await Campground.findById(req.params.id);
  res.render("campgrounds/edit", { camp });
});
app.patch("/campgrounds/:id", async (req, res) => {
  const updateCamp = await Campground.findByIdAndUpdate(
    req.params.id,
    { ...req.body.campground },
    {
      new: true,
      runValidators: true,
    }
  );
  res.redirect(`/campgrounds/${updateCamp._id}`);
});

// delete
app.delete("/campgrounds/:id", async (req, res) => {
  await Campground.findByIdAndDelete(req.params.id);
  res.redirect("/campgrounds");
});

app.listen(8080, () => {
  connectDB();
  console.log("Serving on port 8080");
});
