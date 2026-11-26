import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    purpose: { type: String, default: "" },
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled"],
      default: "scheduled"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Appointment", appointmentSchema);