import { validate } from "../validation/validaton.js";
import { getContactValidation } from "../validation/contact-validation";
import {
  createAddresValidation,
  getAddressValidation,
  updateAddressValidation,
} from "../validation/address-validation";
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

const get = async (user, contactId, addressId) => {
  contactId = await checkContactMustExist(user, contactId);
  addressId = validate(getAddressValidation, addressId);

  const address = await prismaClient.address.findFirst({
    where: {
      contact_id: contactId,
      id: addressId,
    },
    select: {
      id: true,
      street: true,
      city: true,
      province: true,
      country: true,
      postal_code: true,
    },
  });

  if (!address) {
    throw new ResponseError(404, "Address not Found");
  }

  return address;
};

const update = async (user, contactId, request) => {
  contactId = await checkContactMustExist(user, contactId);
  const address = validate(updateAddressValidation, request);

  const totalAddressInDatabase = await prismaClient.address.findFirst({
    where: {
      contact_id: contactId,
      id: address.id,
    },
  });
  if (!totalAddressInDatabase) {
    throw new ResponseError(404, "Address Not Found");
  }

  return prismaClient.address.update({
    where: {
      id: address.id,
    },
    data: {
      street: address.street,
      city: address.city,
      province: address.province,
      country: address.country,
      postal_code: address.postal_code,
    },
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
  get,
  update,
};
