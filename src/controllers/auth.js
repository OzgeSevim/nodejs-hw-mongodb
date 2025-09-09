import { THIRTY_DAY } from "../constants/index.js";
import {
  loginUser,
  LogoutUser,
  registerUser,
  refreshUserSession,
  requestResetToken,
  resetPassword,
} from "../services/auth.js";

export const registerUserController = async (req, res) => {
  try {
    const user = await registerUser(req.body);

    res.status(201).json({
      status: 201,
      message: "Successfully registered a user!",
      data: user,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: "Sunucu hatası",
      error: error.message,
    });
  }
};

const setupSession = async (res, session) => {
  res.cookie("refreshToken", session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAY),
  });
  res.cookie("sessionId", session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAY),
  });
};

export const loginUserController = async (req, res) => {
  try {
    const session = await loginUser(req.body);
    setupSession(res, session);

    res.status(200).json({
      status: 200,
      message: "Successfully logged in an user!",
      data: {
        accessToken: session.accessToken,
      },
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: "Sunucu hatası",
      error: error.message,
    });
  }
};

export const logoutUserController = async (req, res) => {
  try {
    if (req.cookies.sessionId) {
      await LogoutUser(req.cookies.sessionId);
    }
    res.clearCookie("refreshToken");
    res.clearCookie("sessionId");

    res.status(204).send();
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: "Sunucu hatası",
      error: error.message,
    });
  }
};

export const refreshUserController = async (req, res) => {
  try {
    const session = await refreshUserSession({
      sessionId: req.cookies.sessionId,
      refreshToken: req.cookies.refreshToken,
    });

    setupSession(res, session);

    res.status(200).json({
      status: 200,
      message: "Successfully refreshed a session!",
      data: {
        accessToken: session.accessToken,
      },
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: "Sunucu hatası",
      error: error.message,
    });
  }
};

export const requestResetEmailController = async (req, res) => {
  try {
    await requestResetToken(req.body.email);

    res.json({
      status: 200,
      message: "Reset password email has been successfully sent",
      data: {},
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: "Failed to send email, please try again later.",
      error: error.message,
    });
  }
};

export const resetPasswordController = async (req, res) => {
  try {
    await resetPassword(req.body);
    res.json({
      status: 200,
      message: "Password has been successfully reset.",
      data: {},
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: "Sunucu hatası",
      error: error.message,
    });
  }
};
