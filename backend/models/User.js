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
    profilePic: {
      type: String,
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

UserSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};
UserSchema.methods.getProfile = function () {
  return {
    id: this._id,
    username: this.username,
    email: this.email,
    name: this.name,
    gender: this.gender,
    profilePic: this.profilePic,
    createdAt: this.createdAt,
  };
};
UserSchema.methods.generateToken = function () {
  try {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "365d",
    });
    return token;
  } catch (err) {
    return err;
  }
};

const User = mongoose.model("User", UserSchema);
export default User;
