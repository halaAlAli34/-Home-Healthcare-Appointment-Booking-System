import mongoose, {
  Document,
  Model,
  Schema,
  Types,
} from "mongoose";

export type AppointmentStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "cancelled"
  | "completed";

export type CaregiverRole =
  | "Doctor"
  | "Nurse"
  | "Physiotherapist"
  | "Care Assistant";

export interface IAppointment extends Document {
  patientId: Types.ObjectId;
  serviceId: Types.ObjectId;

  serviceName: string;
  servicePrice: number;

  caregiverId: string;
  caregiverName: string;
  caregiverRole: CaregiverRole;
  caregiverSpecialty: string;

  date: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;

  address: string;
  phone: string;
  notes?: string;

  status: AppointmentStatus;

  createdAt: Date;
  updatedAt: Date;
}

const appointmentSchema = new Schema<IAppointment>(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    serviceId: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: true,
      index: true,
    },

    serviceName: {
      type: String,
      required: true,
      trim: true,
    },

    servicePrice: {
      type: Number,
      required: true,
      min: 0,
    },

    caregiverId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    caregiverName: {
      type: String,
      required: true,
      trim: true,
    },

    caregiverRole: {
      type: String,
      enum: [
        "Doctor",
        "Nurse",
        "Physiotherapist",
        "Care Assistant",
      ],
      required: true,
    },

    caregiverSpecialty: {
      type: String,
      required: true,
      trim: true,
    },

    date: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    startTime: {
      type: String,
      required: true,
      trim: true,
    },

    endTime: {
      type: String,
      required: true,
      trim: true,
    },

    durationMinutes: {
      type: Number,
      required: true,
      min: 30,
    },

    address: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
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
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

appointmentSchema.index({
  caregiverId: 1,
  date: 1,
  startTime: 1,
  endTime: 1,
});

const Appointment: Model<IAppointment> =
  mongoose.models.Appointment ||
  mongoose.model<IAppointment>(
    "Appointment",
    appointmentSchema,
  );

export default Appointment;