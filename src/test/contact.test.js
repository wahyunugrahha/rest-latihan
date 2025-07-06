import supertest from "supertest";
import {
  createTestContact,
  createTestUser,
  getTestContact,
  removeAllTestContact,
  removeTestUser,
  createManyTestContact,
  getAuthToken,
} from "./test-util.js";
import { web } from "../application/web.js";

let token;

beforeEach(async () => {
  await createTestUser();
  token = await getAuthToken();
});

afterEach(async () => {
  await removeAllTestContact();
  await removeTestUser();
});

describe("POST /api/contacts", function () {
  it("should create new contact", async () => {
    const result = await supertest(web)
      .post("/api/contacts")
      .set("Authorization", `Bearer ${token}`)
      .send({
        first_name: "test",
        last_name: "test",
        email: "testemail@gmail.com",
        phone: "081234567890",
      });

    expect(result.status).toBe(200);
    expect(result.body.data.first_name).toBe("test");
  });

  it("should reject if invalid token", async () => {
    const result = await supertest(web)
      .post("/api/contacts")
      .set("Authorization", "Bearer wrongtoken")
      .send({
        first_name: "test",
        last_name: "test",
        email: "testemail@gmail.com",
        phone: "081234567890",
      });

    expect(result.status).toBe(401);
  });
});

describe("GET /api/contacts/:contact_id", function () {
  beforeEach(createTestContact);

  it("should get contact by id", async () => {
    const testContact = await getTestContact();

    const result = await supertest(web)
      .get("/api/contacts/" + testContact.id)
      .set("Authorization", `Bearer ${token}`);

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBe(testContact.id);
  });

  it("should return 404 if contact id not found", async () => {
    const testContact = await getTestContact();

    const result = await supertest(web)
      .get("/api/contacts/" + (testContact.id + 100))
      .set("Authorization", `Bearer ${token}`);

    expect(result.status).toBe(404);
  });
});

describe("PUT /api/contacts/:contact_id", function () {
  beforeEach(createTestContact);

  it("should update existing contact", async () => {
    const testContact = await getTestContact();

    const result = await supertest(web)
      .put("/api/contacts/" + testContact.id)
      .set("Authorization", `Bearer ${token}`)
      .send({
        first_name: "update",
        last_name: "update",
        email: "update@gmail.com",
        phone: "08098764523",
      });

    expect(result.status).toBe(200);
    expect(result.body.data.first_name).toBe("update");
  });

  it("should reject if invalid data", async () => {
    const testContact = await getTestContact();

    const result = await supertest(web)
      .put("/api/contacts/" + testContact.id)
      .set("Authorization", `Bearer ${token}`)
      .send({
        first_name: "",
        last_name: "",
        email: "invalidemail",
        phone: "",
      });

    expect(result.status).toBe(400);
  });

  it("should return 404 if contact not found", async () => {
    const result = await supertest(web)
      .put("/api/contacts/9999")
      .set("Authorization", `Bearer ${token}`)
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
  beforeEach(createTestContact);

  it("should delete contact", async () => {
    const testContact = await getTestContact();

    const result = await supertest(web)
      .delete("/api/contacts/" + testContact.id)
      .set("Authorization", `Bearer ${token}`);

    expect(result.status).toBe(200);
    expect(result.body.data).toBe("OK");

    const deletedContact = await getTestContact();
    expect(deletedContact).toBeNull();
  });

  it("should return 404 if contact not found", async () => {
    const testContact = await getTestContact();

    const result = await supertest(web)
      .delete("/api/contacts/" + (testContact.id + 100))
      .set("Authorization", `Bearer ${token}`);

    expect(result.status).toBe(404);
  });
});

describe("GET /api/contacts", function () {
  beforeEach(createManyTestContact);

  it("should return page 1 by default", async () => {
    const result = await supertest(web)
      .get("/api/contacts")
      .set("Authorization", `Bearer ${token}`);

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(10);
    expect(result.body.paging.page).toBe(1);
  });

  it("should return page 2", async () => {
    const result = await supertest(web)
      .get("/api/contacts")
      .query({ page: 2 })
      .set("Authorization", `Bearer ${token}`);

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(5);
    expect(result.body.paging.page).toBe(2);
  });

  it("should filter by name", async () => {
    const result = await supertest(web)
      .get("/api/contacts")
      .query({ name: "test 1" })
      .set("Authorization", `Bearer ${token}`);

    expect(result.status).toBe(200);
    expect(result.body.paging.total_item).toBe(6);
  });

  it("should filter by email", async () => {
    const result = await supertest(web)
      .get("/api/contacts")
      .query({ email: "testemail1" })
      .set("Authorization", `Bearer ${token}`);

    expect(result.status).toBe(200);
    expect(result.body.paging.total_item).toBe(6);
  });

  it("should filter by phone", async () => {
    const result = await supertest(web)
      .get("/api/contacts")
      .query({ phone: "081234567891" })
      .set("Authorization", `Bearer ${token}`);

    expect(result.status).toBe(200);
    expect(result.body.paging.total_item).toBe(6);
  });
});
