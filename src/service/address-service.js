import { validate } from "../validation/validaton.js";
import { getContactValidation } from "../validation/contact-validation";
import { createAddresValidation } from "../validation/address-validation";
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";

const checkContactMustExist = async (user, contact_id) => {
  contact_id = validate(getContactValidation, contact_id);
  const totalContactInDatabase = await prismaClient.contact.count({
    where: {
      username: user.username,
      id: contact_id,
    },
  });

  if (!totalContactInDatabase) {
    throw new ResponseError(404, "Contact Not Found");
  }

  return contact_id;
};

const create = async (user, contact_id, request) => {
  contact_id = await checkContactMustExist(user, contact_id);
  const address = validate(createAddresValidation, request);
  address.contact_id = contact_id;

  request = validate(createAddresValidation, request);

  return prismaClient.address.create({
    data: address,
    select: {
      id: true,
      street: true,
      city: true,
      province: true,
      country: true,
      postal_code: true,
    },
  });
};

export default {
  create,
};
