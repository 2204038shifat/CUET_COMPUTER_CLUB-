import mongoose from "mongoose";

const newsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    excerpt: {
      type: String,
      trim: true,
      maxlength: 500
    },

    content: {
      type: String,
      required: true,
      trim: true
    },

    coverImage: {
      type: String,
      default: ""
    },

    category: {
      type: String,
      enum: [
        "ANNOUNCEMENT",
        "ACHIEVEMENT",
        "WORKSHOP",
        "COMPETITION",
        "GENERAL"
      ],
      default: "GENERAL"
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    approvalStatus: {
      type: String,
      enum: [
        "DRAFT",
        "SUBMITTED",
        "APPROVED",
        "REJECTED",
        "CHANGES_REQUESTED"
      ],
      default: "DRAFT"
    },

    publicationStatus: {
      type: String,
      enum: ["UNPUBLISHED", "PUBLISHED"],
      default: "UNPUBLISHED"
    },

    rejectionReason: {
      type: String,
      trim: true,
      default: ""
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    approvedAt: {
      type: Date,
      default: null
    },

    rejectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    rejectedAt: {
      type: Date,
      default: null
    },

    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const News = mongoose.model("News", newsSchema);

export default News;