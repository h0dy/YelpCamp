import express from "express";
import mongoose from "mongoose";
import methodOverride from "method-override";
import morgan from "morgan";
import ejsMate from "ejs-mate";
import AppError from "./utils/appError.js";
import campRoutes from "./routes/campRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import userRoutes from "./routes/usersRoutes.js";
import flash from "connect-flash";
import passport from "passport";
import LocalStrategy from "passport-local";
import User from "./models/user.js";
import dotenv from "dotenv";
import mongoSanitize from "express-mongo-sanitize"; // for basic security
import helmet from "helmet";
import session from "express-session";
import MongoStore from "connect-mongo";

const app = express();
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/yelp-camp";
const secret = process.env.SECRET || "sosecretkey";
const port = process.env.PORT || 3000;

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
  dotenv.config();
}

const connectDB = async () => {
  try {
    await mongoose.connect(dbUrl);
    if (process.env.NODE_ENV !== "production") {
      console.log("MongoDB Connected");
    }
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.log("Error with connection to DB", err);
    }
  }
};

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views");

const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 60 * 60, // update once every 24 hours
  crypto: {
    secret,
  },
});

const sessionConfig = {
  store,
  name: "LogSession",
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7 * 2, // cookie expires after two weeks
    maxAge: 1000 * 60 * 60 * 24 * 7 * 2,
  },
};

// middlewares
// authentication/sessions
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// security & common files/script from third party libraries to allow into the application
app.use(mongoSanitize());
const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://api.tiles.mapbox.com/",
  "https://api.mapbox.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://api.mapbox.com/",
  "https://api.tiles.mapbox.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
  "https://cdn.jsdelivr.net",
];
const connectSrcUrls = [
  "https://api.mapbox.com/",
  "https://a.tiles.mapbox.com/",
  "https://b.tiles.mapbox.com/",
  "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      objectSrc: [],
      imgSrc: [
        "'self'",
        "blob:",
        "data:",
        `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/`,
        "https://images.unsplash.com/",
      ],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(flash());

// middleware to access a local variable such as flash messages
app.use((req, res, next) => {
  res.locals.signedInUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.info = req.flash("info");
  res.locals.update = req.flash("update");
  res.locals.error = req.flash("error");
  res.locals.currentYear = new Date().getFullYear();
  next();
});

app.get("/", (req, res) => {
  res.render("home");
});
app.use("/", userRoutes);
app.use("/campgrounds", campRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);

app.all(/(.*)/, (req, res, next) => {
  next(new AppError("404 – Page not found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something Went Wrong!";
  res.status(statusCode).render("error", { err });
});

app.listen(port, () => {
  connectDB();
  console.log(`Serving on port ${port}`);
});
