import createHttpError from "http-errors";
import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from "../services/contacts.js";
import { parsePaginationParams } from "../utils/parsePaginationParams.js";
import { parseSortParams } from "../utils/parseSortParams.js";
import { parseFilterParams } from "../utils/parseFilterParams.js";
import { env } from "../utils/env.js";
import saveFileToCloudinary from "../utils/saveFileToCloudinary.js";
import saveFileToUploadDir from "../utils/saveFileToUploadDir.js";
import { CLOUDINARY } from "../constants/index.js";

export const getAllContactsController = async (req, res) => {
  try {
    // const contacts = await getAllContacts();
    console.log(" query params:", req.query);

    const { page, perPage } = parsePaginationParams(req.query);
    const { sortOrder, sortBy } = parseSortParams(req.query);
    const filter = parseFilterParams(req.query);
    const contacts = await getAllContacts({
      page,
      perPage,
      sortOrder,
      sortBy,
      filter,
      userId: req.user._id,
    });

    res.status(200).json({
      status: 200,
      message: "Successfully found contacts!",
      data: contacts,
    });
  } catch (error) {
    console.error("getAllContactsController error:", error);
    console.error(error);
    res.status(500).json({
      status: 500,
      message: "Server Error",
    });
  }
};

export const getContactByIdController = async (req, res) => {
  try {
    const contactId = req.params.contactId;

    const contact = await getContactById(contactId, req.user._id);

    res.status(200).json({
      status: 200,
      message: "Successfully found contact!",
      data: contact,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Server Error",
    });
  }
};

export const createContactController = async (req, res) => {
  try {
    const { name, phoneNumber, email, isFavourite, contactType } = req.body;

    if (!name || !phoneNumber || !contactType) {
      return res.status(400).json({
        status: 400,
        message: "Name,Phone number and Contact type fields are required!",
      });
    }

    const newContact = await createContact({
      name,
      phoneNumber,
      email,
      isFavourite,
      contactType,
      userId: req.user._id,
    });

    res.status(201).json({
      status: 201,
      message: "Successfully created a contact!",
      data: newContact,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Server Error",
    });
  }
};

export const updateContactController = async (req, res) => {
  try {
    const { name, phoneNumber, email, isFavourite, contactType } = req.body;
    const contactId = req.params.contactId;
    const userId = req.user._id;
    const updatedContact = await updateContact(
      contactId,
      userId,
      {
        name,
        phoneNumber,
        email,
        isFavourite,
        contactType,
      },
      { new: true, runValidators: true },
    );

    if (!updatedContact) {
      throw createHttpError(404, "Contact not found");
    }

    res.status(200).json({
      status: 200,
      message: "Successfully patched a contact!",
      data: updatedContact,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Server Error",
    });
  }
};

export const deleteContactController = async (req, res) => {
  try {
    const contactId = req.params.contactId;
    const userId = req.user._id;
    const deletedContact = await deleteContact(contactId, userId);

    if (!deletedContact) {
      throw createHttpError(404, "Contact not found");
    }

    res.status(204).json({
      status: 204,
      message: "Successfully deleted a contact!",
      data: deletedContact,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Server Error",
    });
  }
};

export const uploadContactPhotoController = async (req, res, next) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Dosya yüklenemedi",
      });
    }

    let photoUrl;
    const enableCloudinary = env(CLOUDINARY.ENABLE_CLOUDINARY);

    if (enableCloudinary === "true") {
      photoUrl = await saveFileToCloudinary(file);
    } else {
      const fileName = await saveFileToUploadDir(file);
      photoUrl = `/uploads/${fileName}`;
    }

    res.status(200).json({
      success: true,
      message: "Resim yüklendi",
      data: {
        photoUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};
