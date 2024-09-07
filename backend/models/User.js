import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
    },
    uid: {
      type: String,
    },
    provider: {
      type: String,
      enum: ["google", "github", "local"],
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async () => {
  const user = this;
  if (user.isModified("password")) {
    try {
      user.password = await bcrypt.hash(user.password, 11);
    } catch (err) {
      return next(err);
    }
  }
  next();
});

const User = mongoose.model("User", UserSchema);
export default User;
