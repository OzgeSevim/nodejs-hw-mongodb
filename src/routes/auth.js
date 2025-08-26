import express from "express";
import {
  registerUserController,
  loginUserController,
  logoutUserController,
  refreshUserController,
} from "../controllers/auth.js";
import { validateBody } from "../middlewares/validateBody.js";
import {
  registerUserSchema,
  loginUserSchema,
} from "../validation/authValidation.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";

const router = express.Router();

router.post(
  "/register",
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);

router.post(
  "/login",
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);

router.post("/logout", ctrlWrapper(logoutUserController));

router.post("/refresh", ctrlWrapper(refreshUserController));

export default router;
