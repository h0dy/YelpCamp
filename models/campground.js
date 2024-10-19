import mongoose from "mongoose";

const CampgroundSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "A Campground must have a title"],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "A campground must have a price"],
  },
  description: {
    type: String,
    trim: true,
  },
  location: {
    type: String,
    trim: true,
    required: [true, "A campground must have a location"],
  },
  image: {
    type: String,
    required: [true, "A campground must have an image"],
  },
});

export default mongoose.model("Campground", CampgroundSchema);
