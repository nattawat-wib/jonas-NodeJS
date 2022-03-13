const express = require("express");
const router = express.Router({ mergeParams: true });
const reviewController = require("./../controllers/reviewController");
const authController = require("./../controllers/authController");

router.use(authController.protect);

router
    .route("/")
    .get(reviewController.get_all_review)
    .post(authController.restrict_to("user"), reviewController.set_tour_user_id, reviewController.create_review)
    
router
    .route("/:id")
    .get(reviewController.get_review)
    .delete(authController.restrict_to("user", "admin"), reviewController.delete_review)
    .patch(authController.restrict_to("user", "admin"), reviewController.update_review)
    
module.exports = router;