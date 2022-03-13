const express = require("express");
const router = express.Router();
const viewController = require("./../controllers/viewController");
const authController = require("./../controllers/authController");

router.use(authController.isLoggedIn)

router.get("/", viewController.get_overview)
router.get("/tour/:slug", viewController.get_tour)
router.get("/login", viewController.get_login_form)
// router.get("/sing-up", viewController.get_login_form)

// /LOGIN


module.exports = router; 