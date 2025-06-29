import { prismaClient } from "../application/database.js";
import bcrypt from "bcrypt";
export const removeTestUser = async () => {
  await prismaClient.user.deleteMany({
    where: {
      username: "test",
    },
  });
};

export const getTestUser = async () => {
  return prismaClient.user.findUnique({
    where: {
      username: "test",
    },
  });
};

export const createTestUser = async () => {
  await prismaClient.user.create({
    data: {
      username: "test",
      password: await bcrypt.hash("testpassword", 10),
      name: "testuser",
      token: "token",
    },
  });
};


export const removeAllTestContact = async () => {
  await prismaClient.contact.deleteMany({
    where: {
      username: "test",
    },
  });
};