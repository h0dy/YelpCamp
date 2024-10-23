import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  body: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
});

export default mongoose.model("Review", reviewSchema);
