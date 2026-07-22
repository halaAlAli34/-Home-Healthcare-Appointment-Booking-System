import mongoose, { Schema, models } from "mongoose";

const appointmentSchema = new Schema(
  {
    serviceName: {
      type: String,
      required: true,
      trim: true,
    },

    patientName: {
      type: String,
      required: true,
      trim: true,
    },

    caregiver: {
      type: String,
      default: "To be assigned",
      trim: true,
    },

    date: {
      type: String,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    notes: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "rejected",
        "cancelled",
        "completed",
      ],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

appointmentSchema.index(
  {
    date: 1,
    time: 1,
  },
  {
    unique: true,
  }
);

const Appointment =
  models.Appointment ||
  mongoose.model("Appointment", appointmentSchema);

export default Appointment;