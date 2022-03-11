const express = require("express");
const router = express.Router();
const tourController = require("./../controllers/tourController");
const authController = require("./../controllers/authController");
const reviewController = require("./../controllers/reviewController");
const reviewRouter = require("./../routes/reviewRoutes");

router.use("/:tour_id/reviews", reviewRouter)

// router
//     .route("/:tour_id/reviews")
//     .post(authController.protect, authController.restrict_to("user"), reviewController.create_review)

router.get("/top-5-cheap", tourController.alias_top_tour, tourController.get_all_tours);
router.get("/tour-stats", tourController.get_tour_stats);
router.get("/monthly-plan/:year", tourController.get_monthly_plan);

router
    .route("/")
    .get(tourController.get_all_tours)
    .post(tourController.create_tour)

router
    .route("/:id")
    .get(tourController.get_tour)
    .patch(tourController.update_tour)
    .delete(authController.protect, authController.restrict_to("admin", "lead-guide"), tourController.delete_tour)

module.exports = router; 