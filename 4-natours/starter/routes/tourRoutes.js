const express = require("express");
const router = express.Router();
const tourController = require("./../controllers/tourController")

// router.param("id", tourController.check_id)
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
    .delete(tourController.delete_tour)

module.exports = router; 