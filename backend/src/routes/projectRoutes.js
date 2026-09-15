import express from "express";
import { createProject } from "../controllers/projectController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  authorizeRoles("COMMITTEE", "PRESIDENT"),
  createProject
);

export default router;
