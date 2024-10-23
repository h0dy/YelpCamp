import mongoose from "mongoose";
import Review from "./review.js";

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
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

CampgroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

export default mongoose.model("Campground", CampgroundSchema);
