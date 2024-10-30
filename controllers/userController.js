import User from "../models/user.js";
import catchAsync from "../utils/catchAsync.js";

export const renderRegister = (req, res) => {
  res.render("users/register");
};

export const register = catchAsync(async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const newUser = await User.register(user, password);
    req.login(newUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to Yelp Camp");
      res.redirect("/campgrounds");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/register");
  }
});

export const renderLogin = (req, res) => {
  res.render("users/login");
};

export const login =  async (req, res) => {
  req.flash("success", `welcome back ${req.body.username}!`);
  delete req.session.returnTo; // remove returnTo from the session object
  res.redirect(res.locals.returnTo || "/campgrounds");
};

export const logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbye!");
    res.redirect("/campgrounds");
  });
};
