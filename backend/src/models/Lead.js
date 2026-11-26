
import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    requirements: {
      type: String,
      default: ""
    },
    qualificationStatus: {
      type: String,
      enum: ["new", "qualified", "not-qualified"],
      default: "new"
    },
    conversationSummary: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

const Lead = mongoose.model("Lead", leadSchema);

export default Lead;
