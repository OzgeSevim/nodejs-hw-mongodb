import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  accessToken: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
  accessTokenValidUntil: {
    type: String,
    required: true,
  },
  refreshTokenValidUntil: {
    type: String,
    required: true,
  },
});

// const Session = mongoose.model("Session", sessionSchema);
const Session =
  mongoose.models.Session || mongoose.model("Session", sessionSchema);
export default Session;
