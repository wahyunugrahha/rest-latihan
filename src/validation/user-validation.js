import Joi from "joi";

const registerUserValidation = Joi.object({
  username: Joi.string().required().max(100),
  password: Joi.string().required().max(100),
  name: Joi.string().required().max(100),
});

const loginUserValidation = Joi.object({
  username: Joi.string().required().max(100),
  password: Joi.string().required().max(100),
});

const updateUserValidation = Joi.object({
  username: Joi.string().required().max(100),
  password: Joi.string().optional().max(100),
  name: Joi.string().optional().max(100),
});

const getUserValidation = Joi.string().required().max(100);

const seacrhContactValidation = Joi.object({
  page: Joi.number().min(1).positive().default(1),
  size: Joi.number().min(1).max(100).positive().default(10),
  name: Joi.string().optional(),
  email: Joi.string().optional(),
  phone: Joi.string().optional(),
});

export {
  registerUserValidation,
  loginUserValidation,
  getUserValidation,
  updateUserValidation,
  seacrhContactValidation,
};
