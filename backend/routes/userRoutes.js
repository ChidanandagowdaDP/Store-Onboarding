import express from "express";
import {
  getUsers,
  deleteUser,
  updateUser,
} from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();
router.get("/getusers", authMiddleware, roleMiddleware("admin"), getUsers);
router.delete(
  "/deleteuser/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteUser,
);
router.patch(
  "/updateuser/:id",
  authMiddleware,
  roleMiddleware("admin"),
  updateUser,
);
export default router;
