import createHttpError from "http-errors";
import User from "../db/models/User.js";
import bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import { FIFTEEN_MINUTES, THIRTY_DAY } from "../constants/index.js";
import Session from "../db/models/Session.js";

export const registerUser = async (payload) => {
  const user = await User.findOne({ email: payload.email });
  if (user) {
    throw createHttpError(409, "Email in use");
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  return await User.create({
    ...payload,
    password: encryptedPassword,
  });
};

export const createSession = () => {
  const accessToken = randomBytes(30).toString("base64");
  const refreshToken = randomBytes(30).toString("base64");
  const accessTokenValidUntil = new Date(Date.now() + FIFTEEN_MINUTES);
  const refreshTokenValidUntil = new Date(Date.now() + THIRTY_DAY);

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  };
};

export const loginUser = async (payload) => {
  const user = await User.findOne({ email: payload.email });

  if (!user) return createHttpError(404, "User not found");

  const isEqual = await bcrypt.compare(payload.password, user.password);

  if (!isEqual) return createHttpError(401, "Unauthorized");

  await Session.deleteOne({ userId: user._id });

  const sessionData = createSession();

  return await Session.create({
    userId: user._id,
    ...sessionData,
  });
};

export const LogoutUser = async (sessionId) => {
  await Session.deleteOne({ _id: sessionId });
};

export const refreshUserSession = async ({ sessionId, refreshToken }) => {
  const session = await Session.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) return createHttpError(401, "Session not found");

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (!isSessionTokenExpired)
    return createHttpError(401, "Session token expired");

  const newSession = createSession();
  await Session.deleteOne({ _id: sessionId, refreshToken });

  return await Session.create({
    userId: session.userId,
    ...newSession,
  });
};
