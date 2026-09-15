import express from "express";
import { createNews, getPublishedNews,  getPublishedNewsBySlug,  submitNewsForApproval,  approveNews, rejectNews,  requestChangesOnNews,  updateNews,  publishNews ,  unpublishNews,  getManageNews,  getManageNewsById,  deleteNews,
getNewsStats,getNewsApprovalHistory
 } from "../controllers/newsController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles
} from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get(
  "/manage/stats",
  protect,
  authorizeRoles("COMMITTEE", "PRESIDENT"),
  getNewsStats
);

router.get(
  "/manage/:id/history",
  protect,
  authorizeRoles("COMMITTEE", "PRESIDENT"),
  getNewsApprovalHistory
);

router.get(
  "/manage/:id",
  protect,
  authorizeRoles("COMMITTEE", "PRESIDENT"),
  getManageNewsById
);

router.get("/:slug", getPublishedNewsBySlug);
router.get("/", getPublishedNews);

router.get(
  "/manage",
  protect,
  authorizeRoles("COMMITTEE", "PRESIDENT"),
  getManageNews
);

router.post(
  "/",
  protect,
  authorizeRoles("COMMITTEE", "PRESIDENT"),
  createNews
);

router.post(
  "/:id/submit",
  protect,
  authorizeRoles("COMMITTEE", "PRESIDENT"),
  submitNewsForApproval
);

router.patch(
  "/:id/approve",
  protect,
  authorizeRoles("PRESIDENT"),
  approveNews
);

router.patch(
  "/:id/reject",
  protect,
  authorizeRoles("PRESIDENT"),
  rejectNews
);

router.patch(
  "/:id/request-changes",
  protect,
  authorizeRoles("PRESIDENT"),
  requestChangesOnNews
);

router.patch(
  "/:id",
  protect,
  authorizeRoles("COMMITTEE", "PRESIDENT"),
  updateNews
);

router.patch(
  "/:id/publish",
  protect,
  authorizeRoles("PRESIDENT"),
  publishNews
);

router.patch(
  "/:id/unpublish",
  protect,
  authorizeRoles("PRESIDENT"),
  unpublishNews
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("COMMITTEE", "PRESIDENT"),
  deleteNews
);

export default router;