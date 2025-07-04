import supertest from "supertest";
import {
  createTestContact,
  createTestUser,
  getTestContact,
  removeAllTestContact,
  removeTestUser,
  createManyTestContact,
} from "./test-util";
import { web } from "../application/web.js";

describe("POST /api/contacts", function () {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeAllTestContact();
    await removeTestUser();
  });

  it("should can create new contact", async () => {
    const result = await supertest(web)
      .post("/api/contacts")
      .set("Authorization", "token")
      .send({
        first_name: "test",
        last_name: "test",
        email: "testemail@gmail.com",
        phone: "081234567890",
      });
    console.log(result.body);
    expect(result.status).toBe(200);
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.first_name).toBe("test");
    expect(result.body.data.last_name).toBe("test");
    expect(result.body.data.email).toBe("testemail@gmail.com");
    expect(result.body.data.phone).toBe("081234567890");
  });

  it("should reject if invalid token ", async () => {
    const result = await supertest(web)
      .post("/api/contacts")
      .set("Authorization", "wrongtoken")
      .send();

    expect(result.status).toBe(401);
  });
});
describe("POST /api/contacts/:contact_id", function () {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
  });

  afterEach(async () => {
    await removeAllTestContact();
    await removeTestUser();
  });
  it("Should can create contact", async () => {
    const testContact = await getTestContact();

    const result = await supertest(web)
      .get("/api/contacts/" + testContact.id)
      .set("Authorization", "token");

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBe(testContact.id);
    expect(result.body.data.first_name).toBe(testContact.first_name);
    expect(result.body.data.last_name).toBe(testContact.last_name);
    expect(result.body.data.email).toBe(testContact.email);
    expect(result.body.data.phone).toBe(testContact.phone);
  });

  it("Should return 404 if ontact id not found", async () => {
    const testContact = await getTestContact();

    const result = await supertest(web)
      .get("/api/contacts/" + testContact.id + 1)
      .set("Authorization", "token");

    expect(result.status).toBe(404);
  });
});

describe("PUT /api/contacts/:contact_id", function () {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
  });

  afterEach(async () => {
    await removeAllTestContact();
    await removeTestUser();
  });

  it("Should can update existing contact", async () => {
    const testContact = await getTestContact();

    const result = await supertest(web)
      .put("/api/contacts/" + testContact.id)
      .set("Authorization", "token")
      .send({
        first_name: "update",
        last_name: "update",
        email: "update@gmail.com",
        phone: "08098764523",
      });

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBe(testContact.id);
    expect(result.body.data.first_name).toBe("update");
    expect(result.body.data.last_name).toBe("update");
    expect(result.body.data.email).toBe("update@gmail.com");
    expect(result.body.data.phone).toBe("08098764523");
  });

  it("Should reject if invalid data", async () => {
    const testContact = await getTestContact();

    const result = await supertest(web)
      .put("/api/contacts/" + testContact.id)
      .set("Authorization", "token")
      .send({
        first_name: "",
        last_name: "",
        email: "update",
        phone: "",
      });

    expect(result.status).toBe(400);
  });
  it("Should reject if contact not found", async () => {
    const result = await supertest(web)
      .put("/api/contacts/" + 1)
      .set("Authorization", "token")
      .send({
        first_name: "update",
        last_name: "update",
        email: "update@gmail.com",
        phone: "08098764523",
      });

    expect(result.status).toBe(404);
  });
});

describe("DELETE /api/contacts/:contact_id", function () {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
  });

  afterEach(async () => {
    await removeAllTestContact();
    await removeTestUser();
  });

  it("Should can delete contact", async () => {
    let testContact = await getTestContact();
    const result = await supertest(web)
      .delete("/api/contacts/" + testContact.id)
      .set("Authorization", "token");

    expect(result.status).toBe(200);
    expect(result.body.data).toBe("OK");

    testContact = await getTestContact();
    expect(testContact).toBeNull();
  });
  it("should reject if contact is not found", async () => {
    let testContact = await getTestContact();
    const result = await supertest(web)
      .delete("/api/contacts/" + (testContact.id + 1))
      .set("Authorization", "token");

    expect(result.status).toBe(404);
  });
});

describe("GET /api/contacts", function () {
  beforeEach(async () => {
    await createTestUser();
    await createManyTestContact();
  });
  afterEach(async () => {
    await removeAllTestContact();
    await removeTestUser();
  });

  it("should can search without parameter", async () => {
    const result = await supertest(web)
      .get("/api/contacts")
      .set("Authorization", "token");

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(10);
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.total_page).toBe(2);
    expect(result.body.paging.total_item).toBe(15);
  });

  it("should can search to page 2", async () => {
    const result = await supertest(web)
      .get("/api/contacts")
      .query({ page: 2 })
      .set("Authorization", "token");

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(5);
    expect(result.body.paging.page).toBe(2);
    expect(result.body.paging.total_page).toBe(2);
    expect(result.body.paging.total_item).toBe(15);
  });

  it("should can search with name", async () => {
    const result = await supertest(web)
      .get("/api/contacts")
      .query({ name: "test 1" })
      .set("Authorization", "token");

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(6);
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.total_page).toBe(1);
    expect(result.body.paging.total_item).toBe(6);
  });

  it("should can search with email", async () => {
    const result = await supertest(web)
      .get("/api/contacts")
      .query({ email: "testemail1" })
      .set("Authorization", "token");

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(6);
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.total_page).toBe(1);
    expect(result.body.paging.total_item).toBe(6);
  });

  it("should can search with phone", async () => {
    const result = await supertest(web)
      .get("/api/contacts")
      .query({ phone: "081234567891" })
      .set("Authorization", "token");

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(6);
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.total_page).toBe(1);
    expect(result.body.paging.total_item).toBe(6);
  });
});
