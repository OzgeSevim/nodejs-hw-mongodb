import express from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import {
  createContactController,
  deleteContactController,
  getAllContactsController,
  getContactByIdController,
  updateContactController,
  uploadContactPhotoController,
} from "../controllers/contacts.js";
import { isValidId } from "../middlewares/isValidId.js";
import { validateBody } from "../middlewares/validateBody.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../validation/contactValidation.js";
import { authenticate } from "../middlewares/authenticate.js";
import upload from "../middlewares/multer.js";

import multer from "multer";
const uploads = multer();

const router = express.Router();

router.use(authenticate);

router.get("/", ctrlWrapper(getAllContactsController));

router.get("/:contactId", isValidId, ctrlWrapper(getContactByIdController));

router.post(
  "/",
  upload.none(),
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);

router.delete("/:contactId", isValidId, ctrlWrapper(deleteContactController));

router.patch(
  "/photo",
  authenticate,
  upload.single("photo"),
  uploadContactPhotoController,
);

router.patch(
  "/:contactId",
  validateBody(updateContactSchema),
  isValidId,
  ctrlWrapper(updateContactController),
);

export default router;
