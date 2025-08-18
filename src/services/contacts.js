// import Contact from "../db/models/Contact.js";

import Contact from "../db/models/Contact.js";

// export const getAllContacts = async (req, res) => {
//   try {
//     const contacts = await Contact.find().sort({ createdAt: -1 });
//     res.status(200).json({
//       success: true,
//       message: "Successfully found contacts!",
//       data: contacts,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };

// export const getContactById = async (req, res) => {
//   try {
//     const contactId = req.params.id;
//     const contact = await Contact.findById(contactId);
//     if (!contact) {
//       return res.status(404).json({
//         success: false,
//         message: "Contact not found",
//       });
//     }
//     res.status(200).json({
//       success: true,
//       message: `Successfully found contact with id ${contactId}!`,
//       data: contact,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,x
//       message: "Server error",
//     });
//   }
// };

export const getAllContacts = async () => {
  return Contact.find().sort({ createdAt: -1 });
};

export const getContactById = async (id) => {
  return Contact.findById(id);
};

export const createContact = async (data) => {
  return Contact.create(data);
};

export const updateContact = async (id, data) => {
  return Contact.findByIdAndUpdate(id, data);
};

export const deleteContact = async (id) => {
  return Contact.findByIdAndDelete(id);
};
