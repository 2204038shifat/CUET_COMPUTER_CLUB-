import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
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

    type: {
      type: String,
      enum: ["EVENT", "CONTEST"],
      default: "EVENT"
    },

    bannerImage: {
      type: String,
      default: ""
    },

    date: {
      type: Date,
      required: true
    },

    startTime: {
      type: String,
      trim: true
    },

    endTime: {
      type: String,
      trim: true
    },

    venue: {
      type: String,
      trim: true,
      maxlength: 200
    },

    registrationDeadline: {
      type: Date
    },

    registrationLimit: {
      type: Number,
      min: 1
    },

    registrationRequired: {
      type: Boolean,
      default: false
    },

    organizer: {
      type: String,
      trim: true,
      maxlength: 200
    },

    // Contest-specific information
    contestType: {
      type: String,
      trim: true
    },

    rules: {
      type: String,
      trim: true
    },

    prize: {
      type: String,
      trim: true
    },

    eligibility: {
      type: String,
      trim: true
    },

    problemStatement: {
      type: String,
      trim: true
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
    isDeleted: {
  type: Boolean,
  default: false
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
  },

  {
    timestamps: true
  }
);

const Event = mongoose.model("Event", eventSchema);

export default Event;