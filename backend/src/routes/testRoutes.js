import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get(
  "/user",
  protect,
  authorizeRoles("USER", "COMMITTEE", "PRESIDENT"),
  (req, res) => {
    res.json({
      success: true,
      message: "User access granted",
      user: req.user
    });
  }
);

router.get(
  "/committee",
  protect,
  authorizeRoles("COMMITTEE", "PRESIDENT"),
  (req, res) => {
    res.json({
      success: true,
      message: "Committee access granted",
      user: req.user
    });
  }
);

router.get(
  "/president",
  protect,
  authorizeRoles("PRESIDENT"),
  (req, res) => {
    res.json({
      success: true,
      message: "President access granted",
      user: req.user
    });
  }
);

export default router;