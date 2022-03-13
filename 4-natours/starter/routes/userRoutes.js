const express = require("express");
const router = express.Router();
const userController = require("./../controllers/userController")
const authController = require("./../controllers/authController")

// register & authentication
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);

// managing password
router.post("/forget-password", authController.forget_password);
router.patch("/reset-password/:token", authController.reset_password);

router.use(authController.protect)

router.patch("/update-password", authController.update_password);

// about current login user
router.get("/get-my-account", userController.get_my_account, userController.get_user);
router.patch("/update-my-account", userController.upload_user_photo, userController.resize_user_photo, userController.update_my_account);
router.delete("/delete-my-account", userController.delete_my_account);

router.use(authController.restrict_to("admin"));

router
    .route("/")
    .get(userController.get_all_users)
    // .post(userController.create_user)

router
    .route("/:id")
    .get(userController.get_user)
    .patch(userController.update_user)
    .delete(userController.delete_user)

module.exports = router; 