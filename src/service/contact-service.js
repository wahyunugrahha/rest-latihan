import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import {
  createContactValiidation,
  getContactValidation,
  updateContactValidation,
} from "../validation/contact-validation.js";
import { validate } from "../validation/validaton.js";

const create = async (user, request) => {
  const contact = validate(createContactValiidation, request);
  contact.username = user.username;

  return prismaClient.contact.create({
    data: contact,
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      phone: true,
    },
  });
};

const get = async (user, contactId) => {
  contactId = validate(getContactValidation, contactId);
  const contact = await prismaClient.contact.findFirst({
    where: {
      username: user.username,
      id: contactId,
    },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      phone: true,
    },
  });

  if (!contact) {
    throw new ResponseError(404, "Contact Not Found");
  }

  return contact;
};

const update = async (user, request) => {
  const contact = validate(updateContactValidation, request);

  const totalContactInDatabase = await prismaClient.contact.count({
    where: {
      id: contact.id,
      username: user.username,
    },
  });
  if (totalContactInDatabase !== 1) {
    throw new ResponseError(404, "Contact Not Found");
  }

  return prismaClient.contact.update({
    where: {
      id: contact.id,
    },
    data: {
      first_name: contact.first_name,
      last_name: contact.last_name,
      email: contact.email,
      phone: contact.phone,
    },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      phone: true,
    },
  });
};

export default {
  create,
  get,
  update,
};
