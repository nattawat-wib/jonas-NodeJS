const express = require("express");
const router = express.Router();
const viewController = require("./../controllers/viewController");
const authController = require("./../controllers/authController");
const bookingController = require("./../controllers/bookingController");

router.get("/", bookingController.create_booking_checkout, authController.isLoggedIn, viewController.get_overview)
router.get("/tour/:slug", authController.isLoggedIn, viewController.get_tour)
// router.get("/sing-up", viewController.get_login_form)
router.get("/login", authController.isLoggedIn, viewController.get_login_form)
router.get("/account", authController.protect, viewController.get_account)
router.get("/account-my-tour", authController.protect, viewController.get_my_tour)

router.post("/update-account-data", authController.protect, viewController.update_account_data)

// /LOGIN


module.exports = router; 