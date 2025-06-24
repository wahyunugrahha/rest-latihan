import supertest from "supertest";
import { web } from "../src/application/web.js";
import { removeTestUser } from "./test.util.js";

describe("POST /api/users", function () {
  afterEach(async () => {
    await removeTestUser();
  });

  it("should create a new user", async function () {
    const result = await supertest(web).post("/api/users").send({
      username: "testuser",
      password: "testpassword",
      name: "testuser",
    });
    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("testuser");
    expect(result.body.data.name).toBe("testuser");
    expect(result.body.data.password).toBeUndefined();
  });

  it("should reject if request is invalid", async function () {
    const result = await supertest(web).post("/api/users").send({
      username: "",
      password: "",
      name: "",
    });
    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if username already registered", async function () {
    // 1. Buat user pertama kali (sukses)
    let result = await supertest(web).post("/api/users").send({
      username: "testuser",
      password: "testpassword",
      name: "testuser",
    });

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("testuser");

    // 2. Coba buat user yang sama lagi (gagal)
    result = await supertest(web).post("/api/users").send({
      username: "testuser",
      password: "testpassword",
      name: "testuser",
    });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});
