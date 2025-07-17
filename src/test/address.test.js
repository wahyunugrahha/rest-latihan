import supertest from "supertest";
import { web } from "../application/web.js";
import {
  createTestContact,
  createTestUser,
  createTestAddress,
  getTestContact,
  getTestAddress,
  removeAllTestAddresses,
  removeAllTestContact,
  removeTestUser,
  getAuthToken,
} from "./test-util.js";

let token;

beforeEach(async () => {
  await createTestUser();
  token = await getAuthToken();
});

afterEach(async () => {
  await removeAllTestAddresses();
  await removeAllTestContact();
  await removeTestUser();
});

describe("POST /api/contacts/:contact_id/addresses", function () {
  beforeEach(createTestContact);

  it("should create address", async () => {
    const testContact = await getTestContact();

    const result = await supertest(web)
      .post(`/api/contacts/${testContact.id}/addresses`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        street: "teststreet",
        city: "city",
        province: "province",
        country: "indonesia",
        postal_code: "31923",
      });

    expect(result.status).toBe(200);
    expect(result.body.data.street).toBe("teststreet");
  });

  it("should reject invalid address", async () => {
    const testContact = await getTestContact();

    const result = await supertest(web)
      .post(`/api/contacts/${testContact.id}/addresses`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        street: "teststreet",
        city: "city",
        province: "province",
        country: "",
        postal_code: "",
      });

    expect(result.status).toBe(400);
  });
});

describe("GET /api/contacts/:contactId/addresses/:addressId", function () {
  beforeEach(async () => {
    await createTestContact();
    await createTestAddress();
  });

  it("should get contact address", async () => {
    const contact = await getTestContact();
    const address = await getTestAddress();

    const res = await supertest(web)
      .get(`/api/contacts/${contact.id}/addresses/${address.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.street).toBe("teststreet");
  });

  it("should reject if contact not found", async () => {
    const contact = await getTestContact();
    const address = await getTestAddress();

    const res = await supertest(web)
      .get(`/api/contacts/${contact.id + 1}/addresses/${address.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
  });

  it("should reject if address not found", async () => {
    const contact = await getTestContact();
    const address = await getTestAddress();

    const res = await supertest(web)
      .get(`/api/contacts/${contact.id}/addresses/${address.id + 1}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
  });
});

describe("PUT /api/contacts/:contactId/addresses/:addressId", function () {
  beforeEach(async () => {
    await createTestContact();
    await createTestAddress();
  });

  it("should update address", async () => {
    const contact = await getTestContact();
    const address = await getTestAddress();

    const res = await supertest(web)
      .put(`/api/contacts/${contact.id}/addresses/${address.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        street: "updatestreet",
        city: "updatecity",
        province: "updateprovince",
        country: "updatecountry",
        postal_code: "10000",
      });

    expect(res.status).toBe(200);
    expect(res.body.data.street).toBe("updatestreet");
  });

  it("should reject invalid input", async () => {
    const contact = await getTestContact();
    const address = await getTestAddress();

    const res = await supertest(web)
      .put(`/api/contacts/${contact.id}/addresses/${address.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        street: "updatestreet",
        city: "updatecity",
        province: "updateprovince",
        country: "",
        postal_code: "",
      });

    expect(res.status).toBe(400);
  });

  it("should reject if address not found", async () => {
    const contact = await getTestContact();
    const address = await getTestAddress();

    const res = await supertest(web)
      .put(`/api/contacts/${contact.id}/addresses/${address.id + 1}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        street: "street",
        city: "city",
        province: "province",
        country: "country",
        postal_code: "10000",
      });

    expect(res.status).toBe(404);
  });

  it("should reject if contact not found", async () => {
    const contact = await getTestContact();
    const address = await getTestAddress();

    const res = await supertest(web)
      .put(`/api/contacts/${contact.id + 1}/addresses/${address.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        street: "street",
        city: "city",
        province: "province",
        country: "country",
        postal_code: "10000",
      });

    expect(res.status).toBe(404);
  });
});

describe("DELETE /api/contacts/:contactId/addresses/:addressId", function () {
  beforeEach(async () => {
    await createTestContact();
    await createTestAddress();
  });

  it("should delete address", async () => {
    const contact = await getTestContact();
    const address = await getTestAddress();

    const res = await supertest(web)
      .delete(`/api/contacts/${contact.id}/addresses/${address.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toBe("OK");

    const deleted = await getTestAddress();
    expect(deleted).toBeNull();
  });

  it("should reject if address not found", async () => {
    const contact = await getTestContact();
    const address = await getTestAddress();

    const res = await supertest(web)
      .delete(`/api/contacts/${contact.id}/addresses/${address.id + 1}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
  });

  it("should reject if contact not found", async () => {
    const contact = await getTestContact();
    const address = await getTestAddress();

    const res = await supertest(web)
      .delete(`/api/contacts/${contact.id + 1}/addresses/${address.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
  });
});

describe("GET /api/contacts/:contactId/addresses", function () {
  beforeEach(async () => {
    await createTestContact();
    await createTestAddress();
  });

  it("should list addresses", async () => {
    const contact = await getTestContact();

    const res = await supertest(web)
      .get(`/api/contacts/${contact.id}/addresses`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
  });

  it("should reject if contact not found", async () => {
    const contact = await getTestContact();

    const res = await supertest(web)
      .get(`/api/contacts/${contact.id + 1}/addresses`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
  });
});
