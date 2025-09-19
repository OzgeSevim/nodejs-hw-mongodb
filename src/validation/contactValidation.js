import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).required(),
  phoneNumber: Joi.string().min(3).required(),
  email: Joi.string().min(3),
  isFavourite: Joi.boolean().truthy("true").falsy("false").default(false),
  contactType: Joi.string()
    .valid("work", "home", "personal")
    .default("personal")
    .required(),
}).options({ convert: true });

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3),
  phoneNumber: Joi.string().min(3),
  email: Joi.string().min(3),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid("work", "home", "personal"),
});
