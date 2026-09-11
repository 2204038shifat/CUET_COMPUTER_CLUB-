import express from "express";
import { registerForEvent } from "../controllers/eventRegistrationController.js";
import { protect } from "../middleware/authMiddleware.js";
import {
  cancelEventRegistration
} from "../controllers/eventRegistrationController.js";
import {
  getMyRegistrations
} from "../controllers/eventRegistrationController.js";

import {
  getEventRegistrations
} from "../controllers/eventRegistrationController.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

import {
  getEventRegistrationStats
} from "../controllers/eventRegistrationController.js";



const router = express.Router();

router.post(
  "/:eventId",
  protect,
  registerForEvent
);
router.delete(
  "/:eventId",
  protect,
  cancelEventRegistration
);
router.get(
  "/my",
  protect,
  getMyRegistrations
);
router.get(
  "/event/:eventId",
  protect,
  authorizeRoles("COMMITTEE", "PRESIDENT"),
  getEventRegistrations
);

router.get(
  "/event/:eventId/stats",
  protect,
  authorizeRoles("COMMITTEE", "PRESIDENT"),
  getEventRegistrationStats
);


export default router;