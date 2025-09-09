import createHttpError from "http-errors";
import User from "../db/models/User.js";
import bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import {
  FIFTEEN_MINUTES,
  THIRTY_DAY,
  TEMPLATES_DIR,
} from "../constants/index.js";
import Session from "../db/models/Session.js";
import { SMTP } from "../constants/index.js";
import jwt from "jsonwebtoken";
import { env } from "../utils/env.js";
import path from "node:path";
import fs from "node:fs";
import handlebars from "handlebars";
import { sendMail } from "../utils/sendMail.js";

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

export const requestResetToken = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw createHttpError(404, "User not found!");
  }

  const resetToken = jwt.sign(
    {
      sub: user.id,
      email,
    },
    env("JWT_SECRET"),
    {
      expiresIn: "5m",
    },
  );

  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    "reset-password-email.html",
  );

  const templateSource = await fs
    .readFileSync(resetPasswordTemplatePath)
    .toString();

  const template = handlebars.compile(templateSource);

  const html = template({
    name: user.name,
    link: `${env("APP_DOMAIN")}/reset-password?token=${resetToken}`,
  });

  await sendMail({
    from: env(SMTP.SMTP_FROM),
    to: email,
    subject: "Şifre sıfırlama ekranı",
    html,
  });
};

export const resetPassword = async ({ token, password }) => {
  let entires;
  try {
    entires = jwt.verify(token, env("JWT_SECRET"));
  } catch (error) {
    throw createHttpError(401, "Token is expired or invalid.");
  }

  const user = await User.findOne({
    email: entires.email,
    _id: entires.sub,
  });

  if (!user) {
    throw createHttpError(404, "User not found!");
  }

  const encryptedPassword = await bcrypt.hash(password, 10);

  await User.updateOne({ _id: user._id }, { password: encryptedPassword });

  await Session.deleteMany({ userId: user._id });
};
