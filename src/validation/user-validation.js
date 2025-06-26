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
export { registerUserValidation, loginUserValidation };
