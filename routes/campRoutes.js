import express from "express";
import { isLoggedIn, isOwner, validateCampground } from "../middleware.js";
import * as campController from "../controllers/campController.js";
import multer from "multer";
import { storage } from "../cloudinary/index.js";
const upload = multer({ storage });

const router = express.Router();

//rendering forms
router.get("/new", isLoggedIn, campController.renderNewForm);
router.get("/:id/edit", isLoggedIn, isOwner, campController.renderEditForm);

router
  .route("/")
  .get(campController.index)
  .post(
    isLoggedIn,
    upload.array("image"),
    validateCampground,
    campController.createCamp
  );

router
  .route("/:id")
  .get(campController.findOneCamp)
  .patch(
    isLoggedIn,
    isOwner,
    upload.array("image"),
    validateCampground,
    campController.updateCamp
  )
  .delete(isLoggedIn, isOwner, campController.deleteCamp);

export default router;
