const express = require("express");
const router = express.Router();
const reviewController = require("./../controllers/reviewController");
const authController = require("./../controllers/authController");

router
    .route("/")
    .get(authController.protect, reviewController.get_all_review)
    .post(authController.protect, authController.restrict_to("user"), reviewController.create_review)

module.exports = router;