import mongoose from "mongoose";

const newsApprovalHistorySchema = new mongoose.Schema(
  {
    news: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "News",
      required: true
    },

    action: {
      type: String,
      enum: [
        "SUBMITTED",
        "APPROVED",
        "REJECTED",
        "CHANGES_REQUESTED",
        "PUBLISHED",
        "UNPUBLISHED"
      ],
      required: true
    },

    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    reason: {
      type: String,
      trim: true,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

const NewsApprovalHistory = mongoose.model(
  "NewsApprovalHistory",
  newsApprovalHistorySchema
);

export default NewsApprovalHistory;