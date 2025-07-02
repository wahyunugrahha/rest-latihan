import { validate } from "../validation/validaton.js";
import { getContactValidation } from "../validation/contact-validation";
import { createaAddressValidation } from "../validation/address-validation";
import { prismaClient } from "../application/database.js";

const checkContactMustExist = async (user, contactId) => {
  contactId = validate(getContactValidation, contactId);
  const totalContactInDatabase = await prismaClient.contact.count({
    where: {
      username: user.username,
      id: contactId,
    },
  });

  if (!totalContactInDatabase) {
    throw new ResponseError(404, "Contact Not Found");
  }

  return contactId;
};

const create = async (user, contactId, request) => {
  contactId = await checkContactMustExist(user, contactId);
  const address = validate(createaAddressValidation, request);
  address.contactId = contactId;

  request = validate(createaAddressValidation, request);

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
