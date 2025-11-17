import express from "express";
import UserController from "../controllers/user.js";

const router = express.Router();

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.put("/change-password", UserController.changePassword);

export default router;
