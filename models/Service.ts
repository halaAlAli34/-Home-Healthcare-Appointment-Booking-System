import mongoose, { Schema, Document, Model } from "mongoose";

export type ServiceCategory =
  | "Nursing"
  | "Recovery"
  | "Medical"
  | "Companionship"
  | "Preventive";


export interface IService extends Document {
  name: string;
  category: ServiceCategory;
  durationMinutes: number;
  price: number;
  description: string;
  imageUrl?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}


const ServiceSchema = new Schema<IService>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Nursing",
        "Recovery",
        "Medical",
        "Companionship",
        "Preventive",
      ],
    },

    durationMinutes: {
      type: Number,
      required: true,
      min: 1,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    imageUrl: {
      type: String,
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);


const Service: Model<IService> =
  mongoose.models.Service ||
  mongoose.model<IService>("Service", ServiceSchema);


export default Service;