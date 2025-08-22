import { SORT_ORDER } from "../constants/index.js";
import Contact from "../db/models/Contact.js";
import { calculatePaginationData } from "../utils/calculatePaginationParams.js";

// export const getAllContacts = async () => {
//   return Contact.find().sort({ createdAt: -1 });
// };

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = "_id",
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = Contact.find(filter);
  const contactsCount = await Contact.find(filter)
    .merge(contactsQuery)
    .countDocuments();

  const contacts = await contactsQuery
    .limit(limit)
    .skip(skip)
    .sort({ [sortBy]: sortOrder })
    .exec();

  const paginationData = calculatePaginationData(contactsCount, page, perPage);

  return {
    data: contacts,
    ...paginationData,
  };
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
