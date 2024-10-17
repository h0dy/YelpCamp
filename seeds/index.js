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
      price: Math.floor(Math.random() * 199) + 38,
      description:
        "nima animi quidem! Impedit, amet! Iure, ex. Dolor perspiciatis asperiores temporibus fuga facilis. Iure, quibusdam deserunt suscipit perferendis perspiciatis explicabo minus.",
      location: `${cities[random999].city}, ${cities[random999].state}`,
      image: `https://picsum.photos/1240?random=${Math.floor(
        Math.random() * 100
      )}`,
    });
  }
};
seedDB();
seedDB().then(() => {
  mongoose.connection.close();
});
