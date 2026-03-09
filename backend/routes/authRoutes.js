import express from "express";
import {
  createUser,
  login,
  changePassword,
} from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post(
  "/user/create",
  authMiddleware,
  roleMiddleware("admin"),
  createUser,
);
router.post("/change-password", authMiddleware, changePassword);

router.post("/login", login);

export default router;
