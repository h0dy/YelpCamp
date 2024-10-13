import mongoose from "mongoose";
import Campground from "../models/campground.js";
import cities from "./cities.js";
import { places, descriptors } from "./seedHelpers.js";

(async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/yelp-camp");
    console.log("MongoDB Connected");
  } catch (err) {
    console.log("Error with connection to DB", err);
  }
})();
const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];
const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random999 = Math.floor(Math.random() * 999);
    await Campground.create({
      title: `${sample(descriptors)} ${sample(places)}`,
      location: `${cities[random999].city}, ${cities[random999].state}`,
      price: Math.floor(Math.random() * 1099) + 300,
    });
  }
};
seedDB();
seedDB().then(() => {
  mongoose.connection.close();
});
