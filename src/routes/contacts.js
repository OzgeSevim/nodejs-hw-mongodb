import express from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import {
  createContactController,
  deleteContactController,
  getAllContactsController,
  getContactByIdController,
  updateContactController,
} from "../controllers/contacts.js";
import { isValidId } from "../middlewares/isValidId.js";
import { validateBody } from "../middlewares/validateBody.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../validation/contactValidation.js";

const router = express.Router();

router.get("/", ctrlWrapper(getAllContactsController));

router.get("/:contactId", isValidId, ctrlWrapper(getContactByIdController));

router.post(
  "/",
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);

router.patch(
  "/:contactId",
  validateBody(updateContactSchema),
  isValidId,
  ctrlWrapper(updateContactController),
);

router.delete("/:contactId", isValidId, ctrlWrapper(deleteContactController));

export default router;
