import express from "express";
import mongoose from "mongoose";
import methodOverride from "method-override";
import morgan from "morgan";
import ejsMate from "ejs-mate";
import AppError from "./utils/appError.js";
import campRoutes from "./routes/campRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import userRoutes from "./routes/usersRoutes.js";
import session from "express-session";
import flash from "connect-flash";
import globalErrorHandler from "./controllers/errorController.js";
import passport from "passport";
import LocalStrategy from "passport-local";
import User from ".//models/user.js";
const app = express();

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/yelp-camp");
    console.log("MongoDB Connected");
  } catch (err) {
    console.log("Error with connection to DB", err);
  }
};

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views");

const sessionConfig = {
  secret: "sosecretkey",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7 * 2, // cookie expires after two weeks
    maxAge: 1000 * 60 * 60 * 24 * 7 * 2,
  },
};
// middlewares
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(flash());
app.use((req, res, next) => {
  res.locals.signedInUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.info = req.flash("info");
  res.locals.update = req.flash("update");
  res.locals.error = req.flash("error");
  next();
});

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", (req, res) => {
  res.render("home");
});
app.use("/", userRoutes);
app.use("/campgrounds", campRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);

app.all(/(.*)/, (req, res, next) => {
  next(new AppError("404 – Page not found", 404));
});
// app.use((err, req, res, next) => {
//   const { statusCode = 500, message = "something went wrong!" } = err;
//   if (!err.message) err.message = "something went wrong!";
//   res.status(statusCode).render("error", { err });
// });
app.use(globalErrorHandler);

app.listen(8080, () => {
  connectDB();
  console.log("Serving on port 8080");
});
