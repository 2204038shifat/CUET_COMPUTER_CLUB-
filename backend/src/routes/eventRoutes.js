import express from "express";
import { createEvent } from "../controllers/eventController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import {
  getPublishedEvents
} from "../controllers/eventController.js";
import {
  getPublishedEventBySlug
} from "../controllers/eventController.js";
import {
  submitEventForApproval
} from "../controllers/eventController.js";

import {
  approveEvent
} from "../controllers/eventController.js";

import {
  rejectEvent
} from "../controllers/eventController.js";

import {
  requestEventChanges
} from "../controllers/eventController.js";

import {
  updateEvent
} from "../controllers/eventController.js";

import {
  publishEvent
} from "../controllers/eventController.js";

import {
  unpublishEvent
} from "../controllers/eventController.js";


import {
  getManageableEvents
} from "../controllers/eventController.js";


import {
  deleteEvent
} from "../controllers/eventController.js";





const router = express.Router();

router.get("/", getPublishedEvents);
router.get("/:slug", getPublishedEventBySlug);




router.post(
  "/",
  protect,
  authorizeRoles("COMMITTEE", "PRESIDENT"),
  createEvent
);
router.post(
  "/:id/submit",
  protect,
  authorizeRoles("COMMITTEE", "PRESIDENT"),
  submitEventForApproval
);

router.patch(
  "/:id/approve",
  protect,
  authorizeRoles("PRESIDENT"),
  approveEvent
);

router.patch(
  "/:id/reject",
  protect,
  authorizeRoles("PRESIDENT"),
  rejectEvent
);

router.patch(
  "/:id/request-changes",
  protect,
  authorizeRoles("PRESIDENT"),
  requestEventChanges
);

router.put(
  "/:id",
  protect,
  authorizeRoles("COMMITTEE", "PRESIDENT"),
  updateEvent
);

router.patch(
  "/:id/publish",
  protect,
  authorizeRoles("PRESIDENT"),
  publishEvent
);

router.patch(
  "/:id/unpublish",
  protect,
  authorizeRoles("PRESIDENT"),
  unpublishEvent
);

router.get(
  "/manage",
  protect,
  authorizeRoles("COMMITTEE", "PRESIDENT"),
  getManageableEvents
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("COMMITTEE", "PRESIDENT"),
  deleteEvent
);


export default router;