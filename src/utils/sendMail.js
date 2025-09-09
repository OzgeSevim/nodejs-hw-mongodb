import nodemailer from "nodemailer";
import { env } from "../utils/env.js";
import { SMTP } from "../constants/index.js";

const transporter = nodemailer.createTransport({
  host: env(SMTP.SMTP_HOST),
  port: Number(env(SMTP.SMTP_PORT)),
  secure: false,
  auth: {
    user: env(SMTP.SMTP_USER),
    pass: env(SMTP.SMTP_PASSWORD),
  },
});

export const sendMail = async (options) => {
  try {
    const result = await transporter.sendMail(options);
    console.log("mail gönderildi");
    return result;
  } catch (error) {
    console.log("Email gönderme hatası", error);
    throw error;
  }
};
