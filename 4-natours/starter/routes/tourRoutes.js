const express = require("express");
const router = express.Router();
const tourController = require("./../controllers/tourController")

router.param("id", tourController.check_id)

router
    .route("/")
    .get(tourController.get_all_tours)
    .post(tourController.validate_tour, tourController.create_tour)

router
    .route("/:id")
    .get(tourController.get_tour)
    .patch(tourController.update_tour)
    .delete(tourController.delete_tour)

module.exports = router; 