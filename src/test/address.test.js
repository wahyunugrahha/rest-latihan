import supertest from "supertest";
import { web } from "../application/web.js";
import {
  createTestContact,
  createTestUser,
  getTestContact,
  removeAllTestAddresses,
  removeAllTestContact,
  removeTestUser,
} from "./test-util";

describe("POST /api/contacts/:contactId/addresses", function () {
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
        postalCode: "",
      });

    expect(result.status).toBe(400);
  });
});
