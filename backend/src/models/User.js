import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      minlength: 8
    },

    studentId: {
      type: String,
      trim: true,
      unique: true,
      sparse: true
    },

    department: {
      type: String,
      trim: true,
      maxlength: 100
    },

    phone: {
      type: String,
      trim: true,
      maxlength: 20
    },

    role: {
      type: String,
      enum: ["USER", "COMMITTEE", "PRESIDENT"],
      default: "USER"
    },

    isActive: {
      type: Boolean,
      default: true
    },

    profileImage: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);

export default User;