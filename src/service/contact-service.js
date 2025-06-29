import { prismaClient } from "../application/database.js";
import { createContactValiidation } from "../validation/contact-validation.js";
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

export default {
  create,
};
