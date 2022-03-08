const express = require("express");
const router = express.Router();
const userController = require("./../controllers/userController")
const authController = require("./../controllers/authController")

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.post("/forget-password", authController.forget_password);
router.patch("/reset-password/:token", authController.reset_password);
router.patch("/update-password", authController.protect, authController.update_password);

router.patch("/edit-profile", authController.protect, userController.edit_profile);
router.delete("/delete-account", authController.protect, userController.delete_account);

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