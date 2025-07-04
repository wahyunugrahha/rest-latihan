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
} from "./test-util";

describe("POST /api/contacts/:contact_id/addresses", function () {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
  });

  afterEach(async () => {
    await removeAllTestAddresses();
    await removeAllTestContact();
    await removeTestUser();
  });

  it("Should can create address", async () => {
    const testContact = await getTestContact();

    const result = await supertest(web)
      .post("/api/contacts/" + testContact.id + "/addresses")
      .set("Authorization", "token")
      .send({
        street: "teststreet",
        city: "city",
        province: "province",
        country: "indonesia",
        postal_code: "31923",
      });

    console.log(result.body);
    expect(result.status).toBe(200);
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.street).toBe("teststreet");
    expect(result.body.data.city).toBe("city");
    expect(result.body.data.province).toBe("province");
    expect(result.body.data.country).toBe("indonesia");
    expect(result.body.data.postal_code).toBe("31923");
  });

  it("Should reject if invalid address", async () => {
    const testContact = await getTestContact();

    const result = await supertest(web)
      .post("/api/contacts/" + testContact.id + "/addresses")
      .set("Authorization", "token")
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
    await createTestUser();
    await createTestContact();
    await createTestAddress();
  });

  afterEach(async () => {
    await removeAllTestAddresses();
    await removeAllTestContact();
    await removeTestUser();
  });
  it("Should can get contact addresses", async () => {
    const testContact = await getTestContact();
    const testAddress = await getTestAddress();

    const result = await supertest(web)
      .get("/api/contacts/" + testContact.id + "/addresses/" + testAddress.id)
      .set("Authorization", "token");

    console.log(result.body);
    expect(result.status).toBe(200);
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.street).toBe("teststreet");
    expect(result.body.data.city).toBe("city");
    expect(result.body.data.province).toBe("province");
    expect(result.body.data.country).toBe("indonesia");
    expect(result.body.data.postal_code).toBe("31923");
  });

  it("Should reject if contact not found", async () => {
    const testContact = await getTestContact();
    const testAddress = await getTestAddress();

    const result = await supertest(web)
      .get(
        "/api/contacts/" + (testContact.id + 1) + "/addresses/" + testAddress.id
      )
      .set("Authorization", "token");
    expect(result.status).toBe(404);
  });

  it("Should reject if contact not found", async () => {
    const testContact = await getTestContact();
    const testAddress = await getTestAddress();

    const result = await supertest(web)
      .get(
        "/api/contacts/" + testContact.id + "/addresses/" + (testAddress.id + 1)
      )
      .set("Authorization", "token");
    expect(result.status).toBe(404);
  });
});
describe("PUT /api/contacts/:contactId/addresses/:addressId", function () {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
    await createTestAddress();
  });
  afterEach(async () => {
    await removeAllTestAddresses();
    await removeAllTestContact();
    await removeTestUser();
  });

  it("Should can update address", async () => {
    const testContact = await getTestContact();
    const testAddress = await getTestAddress();

    const result = await supertest(web)
      .put("/api/contacts/" + testContact.id + "/addresses/" + testAddress.id)
      .set("Authorization", "token")
      .send({
        street: "updatestreet",
        city: "updatecity",
        province: "updateprovince",
        country: "updatecountry",
        postal_code: "10000",
      });
    console.log(result.body);
    expect(result.status).toBe(200);
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.street).toBe("updatestreet");
    expect(result.body.data.city).toBe("updatecity");
    expect(result.body.data.province).toBe("updateprovince");
    expect(result.body.data.country).toBe("updatecountry");
    expect(result.body.data.postal_code).toBe("10000");
  });

  it("Should reject if input is invalid", async () => {
    const testContact = await getTestContact();
    const testAddress = await getTestAddress();

    const result = await supertest(web)
      .put("/api/contacts/" + testContact.id + "/addresses/" + testAddress.id)
      .set("Authorization", "token")
      .send({
        street: "updatestreet",
        city: "updatecity",
        province: "updateprovince",
        country: "",
        postal_code: "",
      });
    console.log(result.body);
    expect(result.status).toBe(400);
  });
  it("Should reject if address id is not found", async () => {
    const testContact = await getTestContact();
    const testAddress = await getTestAddress();

    const result = await supertest(web)
      .put(
        "/api/contacts/" + testContact.id + "/addresses/" + (testAddress.id + 1)
      )
      .set("Authorization", "token")
      .send({
        street: "updatestreet",
        city: "updatecity",
        province: "updateprovince",
        country: "updatecountry",
        postal_code: "10000",
      });

    expect(result.status).toBe(404);
  });
  it("Should reject if contact id is not found", async () => {
    const testContact = await getTestContact();
    const testAddress = await getTestAddress();

    const result = await supertest(web)
      .put(
        "/api/contacts/" + (testContact.id + 1) + "/addresses/" + testAddress.id
      )
      .set("Authorization", "token")
      .send({
        street: "updatestreet",
        city: "updatecity",
        province: "updateprovince",
        country: "updatecountry",
        postal_code: "10000",
      });

    expect(result.status).toBe(404);
  });
});
describe("DELETE /api/contacts/:contactId/addresses/addressId", function () {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
    await createTestAddress();
  });
  afterEach(async () => {
    await removeAllTestAddresses();
    await removeAllTestContact();
    await removeTestUser();
  });

  it("Should can remove address", async () => {
    const testContact = await getTestContact();
    let testAddress = await getTestAddress();

    const result = await supertest(web)
      .delete(
        "/api/contacts/" + testContact.id + "/addresses/" + testAddress.id
      )
      .set("Authorization", "token");
    console.log(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data).toBe("OK");
    testAddress = await getTestAddress();
    expect(testAddress).toBeNull();
  });
  it("Should reject if address not found", async () => {
    const testContact = await getTestContact();
    let testAddress = await getTestAddress();

    const result = await supertest(web)
      .delete(
        "/api/contacts/" + testContact.id + "/addresses/" + (testAddress.id + 1)
      )
      .set("Authorization", "token");
    expect(result.status).toBe(404);
  });

  it("Should reject if contact not found", async () => {
    const testContact = await getTestContact();
    let testAddress = await getTestAddress();

    const result = await supertest(web)
      .delete(
        "/api/contacts/" + (testContact.id + 1) + "/addresses/" + testAddress.id
      )
      .set("Authorization", "token");
    expect(result.status).toBe(404);
  });
});
describe("GET /api/contacts/:contactId/addresses/", function () {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
    await createTestAddress();
  });
  afterEach(async () => {
    await removeAllTestAddresses();
    await removeAllTestContact();
    await removeTestUser();
  });

  it("should can list addresses", async () => {
    const testContact = await getTestContact();

    const result = await supertest(web)
      .get("/api/contacts/" + testContact.id + "/addresses")
      .set("Authorization", "token");

    console.log(result.body);
    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(1);
  });

  it("should reject if contact is not found", async () => {
    const testContact = await getTestContact();

    const result = await supertest(web)
      .get("/api/contacts/" + (testContact.id + 1) + "/addresses")
      .set("Authorization", "token");

    expect(result.status).toBe(404);
  });
});
