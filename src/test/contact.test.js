import supertest from "supertest";
import {
  createTestUser,
  removeAllTestContact,
  removeTestUser,
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
