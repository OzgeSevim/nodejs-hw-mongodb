import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.methods.toJson = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

// const User = mongoose.model("User", userSchema);
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
