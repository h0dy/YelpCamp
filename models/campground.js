import mongoose from "mongoose";
import Review from "./review.js";

const imageSchema = new mongoose.Schema({
  url: String,
  filename: String,
});
imageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_300");
});
const CampgroundSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
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
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    images: [imageSchema],
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  {
    // schema option, not stored in the db
    toJSON: { virtuals: true },
  }
);
CampgroundSchema.virtual("properties.popUpMarkup").get(function () {
  return `<h6>${this.title} </h6>\n
  <p>${this.description.substring(0, 40)}...</p>\n
  <a href="campgrounds/${this._id}">View ${this.title}</a>`;
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
