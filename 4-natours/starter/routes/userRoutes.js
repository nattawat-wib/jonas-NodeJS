const express = require("express");
const router = express.Router();
const userController = require("./../controllers/userController")
const authController = require("./../controllers/authController")

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.post("/forget-password", authController.forget_password);
router.post("/reset-password", authController.reset_password);

router
    .route("/")
    .get(authController.protect, userController.get_all_users)
    .post(userController.create_user)

router
    .route("/:id")
    .get(userController.get_user)
    .patch(userController.update_user)
    .delete(userController.delete_user)

    module.exports = router; 