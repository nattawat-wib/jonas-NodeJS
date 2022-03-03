const express = require("express");
const router = express.Router();
const userController = require("./../controllers/userController")

router
    .route("/")
    .get(userController.get_all_users)
    .post(userController.create_user)

router
    .route("/:id")
    .get(userController.get_user)
    .patch(userController.update_user)
    .delete(userController.delete_user)

    module.exports = router; 