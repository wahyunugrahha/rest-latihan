import { prismaClient } from "../application/database.js";
import bcrypt from "bcrypt";
import supertest from "supertest";
import { web } from "../application/web.js";

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
export const createTestContact = async () => {
  await prismaClient.contact.create({
    data: {
      username: "test",
      first_name: "test",
      last_name: "test",
      email: "testemail@gmail.com",
      phone: "081234567890",
    },
  });
};

export const createManyTestContact = async () => {
  for (let i = 0; i < 15; i++) {
    await prismaClient.contact.create({
      data: {
        username: `test`,
        first_name: `test ${i}`,
        last_name: `test ${i}`,
        email: `testemail${i}@gmail.com`,
        phone: `08123456789${i}`,
      },
    });
  }
};

export const getTestContact = async () => {
  return prismaClient.contact.findFirst({
    where: {
      username: "test",
    },
  });
};

export const removeAllTestAddresses = async () => {
  await prismaClient.address.deleteMany({
    where: {
      contact: {
        username: "test",
      },
    },
  });
};
export const createTestAddress = async () => {
  const contact = await getTestContact();
  await prismaClient.address.create({
    data: {
      contact_id: contact.id,
      street: "teststreet",
      city: "city",
      province: "province",
      country: "indonesia",
      postal_code: "31923",
    },
  });
};

export const getTestAddress = async () => {
  return prismaClient.address.findFirst({
    where: {
      contact: {
        username: "test",
      },
    },
  });
};

export const getAuthToken = async () => {
  const loginResult = await supertest(web).post("/api/users/login").send({
    username: "test",
    password: "testpassword",
  });
  if (loginResult.status !== 200) {
    throw new Error("Failed to login and get token for tests");
  }
  return loginResult.body.data.token;
};
