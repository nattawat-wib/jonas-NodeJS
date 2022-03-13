const express = require("express");
const bookingController = require("./../controllers/bookingController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router.get("/checkout-session/:tour_id", bookingController.get_checkout_session)

router.use(authController.restrict_to("lead-guide", "admin"));

router
    .route("/")
    .get(bookingController.get_all_booking)
    .post(bookingController.create_booking)
    
router
    .route("/:id")
    .get(bookingController.get_booking)
    .patch(bookingController.update_booking)
    .delete(bookingController.delete_booking)

module.exports = router;