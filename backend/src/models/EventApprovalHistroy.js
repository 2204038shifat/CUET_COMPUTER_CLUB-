import mongoose from "mongoose";

const eventApprovalHistorySchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
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

const EventApprovalHistory = mongoose.model(
  "EventApprovalHistory",
  eventApprovalHistorySchema
);

export default EventApprovalHistory;