import Joi from "joi";

const createContactValiidation = Joi.object({
  first_name: Joi.string().max(100).required(),
  last_name: Joi.string().max(100).optional(),
  email: Joi.string().max(100).email().optional(),
  phone: Joi.string().max(20).optional(),
});

const getContactValidation = Joi.number().positive().required();

const updateContactValidation = Joi.object({
  id: Joi.number().positive().required(),
  first_name: Joi.string().max(100).optional(),
  last_name: Joi.string().max(100).optional(),
  email: Joi.string().max(100).email().optional(),
  phone: Joi.string().max(20).optional(),
});
export {
  createContactValiidation,
  getContactValidation,
  updateContactValidation,
};
