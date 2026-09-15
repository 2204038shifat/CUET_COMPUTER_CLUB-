import mongoose from "mongoose";

const projectApprovalHistorySchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
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

const ProjectApprovalHistory = mongoose.model(
  "ProjectApprovalHistory",
  projectApprovalHistorySchema
);

export default ProjectApprovalHistory;