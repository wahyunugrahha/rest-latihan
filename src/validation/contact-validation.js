import Joi from "joi";

const createContactValiidation = Joi.object({
  first_name: Joi.string().max(100).required(),
  last_name: Joi.string().max(100).optional(),
  email: Joi.string().max(100).email().optional(),
  phone: Joi.string().max(20).optional(),
});

export { createContactValiidation };
