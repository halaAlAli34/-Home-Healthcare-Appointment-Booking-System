import mongoose, { Schema, models } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Enter a valid email address"],
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false, // never returned unless explicitly requested with .select("+password")
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["patient", "admin"],
      default: "patient",
    },
  },
  {
    timestamps: true,
  }
);

// Hash the password automatically whenever it's created or changed —
// so no other file ever needs to remember to call bcrypt itself.
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password as string, salt);
});

userSchema.methods.comparePassword = function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

const User = models.User || mongoose.model("User", userSchema);
export default User;
