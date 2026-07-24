import mongoose, {
  Document,
  Model,
  Schema,
} from "mongoose";

export interface IService extends Document {
  name: string;
  description: string;
  category: string;
  price: number;
  durationMinutes: number;
  imageUrl?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema = new Schema<IService>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Medical",
        "Nursing",
        "Recovery",
        "Preventive",
        "Companionship",
      ],
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    durationMinutes: {
      type: Number,
      required: true,
      min: 30,
      default: 30,
    },

    imageUrl: {
      type: String,
      default: "",
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const Service: Model<IService> =
  mongoose.models.Service ||
  mongoose.model<IService>("Service", serviceSchema);

export default Service;