import Joi from "joi";

const createAddresValidation = Joi.object({
  street: Joi.string().optional().max(256),
  city: Joi.string().optional().max(100),
  province: Joi.string().optional().max(100),
  country: Joi.string().required().max(100),
  postal_code: Joi.string().required().max(10),
});

const getAddressValidation = Joi.number().positive().min(1).required();

export { createAddresValidation, getAddressValidation };
