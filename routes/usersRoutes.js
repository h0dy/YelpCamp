import express from "express";
import passport from "passport";
import { storeReturnTo } from "../middleware.js";
import * as userController from "../controllers/userController.js";

const router = express.Router();

router
  .route("/register")
  .get(userController.renderRegister)
  .post(userController.register);

router
  .route("/login")
  .get(userController.renderLogin)
  .post(
    storeReturnTo,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    userController.login
  );
router.get("/logout", userController.logout);

export default router;
