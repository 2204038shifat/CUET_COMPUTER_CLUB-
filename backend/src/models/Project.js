import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
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

    shortDescription: {
      type: String,
      trim: true,
      maxlength: 500
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    coverImage: {
      type: String,
      default: ""
    },

    technologies: {
      type: [String],
      default: []
    },

    projectUrl: {
      type: String,
      trim: true,
      default: ""
    },

    githubUrl: {
      type: String,
      trim: true,
      default: ""
    },

    category: {
      type: String,
      enum: [
        "WEB",
        "AI_ML",
        "MOBILE",
        "IOT",
        "ROBOTICS",
        "RESEARCH",
        "OTHER"
      ],
      default: "OTHER"
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

const Project = mongoose.model("Project", projectSchema);

export default Project;