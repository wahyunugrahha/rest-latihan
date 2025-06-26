import supertest from "supertest";
import { web } from "../application/web.js";
import { createTestUser, removeTestUser } from "./test-util.js";

describe("POST /api/users", function () {
  afterEach(async () => {
    await removeTestUser();
  });
  it("should can register user", async () => {
    const result = await supertest(web).post("/api/users").send({
      username: "test",
      password: "testpassword",
      name: "test user",
    });
    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("test");
    expect(result.body.data.password).toBeUndefined();
    expect(result.body.data.name).toBe("test user");
  });

  it("should reject if inpuut is invalid", async () => {
    const result = await supertest(web).post("/api/users").send({
      username: "",
      password: "",
      name: "",
    });
    console.log(result.body);
    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
  it("should reject if username already registered", async function () {
    // 1. Buat user pertama kali (sukses)
    let result = await supertest(web).post("/api/users").send({
      username: "test",
      password: "testpassword",
      name: "test",
    });

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("test");

    // 2. Coba buat user yang sama lagi (gagal)
    result = await supertest(web).post("/api/users").send({
      username: "test",
      password: "testpassword",
      name: "test",
    });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});

describe("POST /api/users/login", function () {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it("should login with valid credentials", async function () {
    const result = await supertest(web).post("/api/users/login").send({
      username: "test",
      password: "testpassword",
    });

    console.log(result.body);
    expect(result.status).toBe(200);
    expect(result.body.data.token).toBeDefined();
    expect(result.body.data.token).not.toBe("token");
  });

  it("should reject with invalid credentials", async function () {
    const result = await supertest(web).post("/api/users/login").send({
      username: "",
      password: "",
    });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject with wrong password", async function () {
    const result = await supertest(web).post("/api/users/login").send({
      username: "test",
      password: "wrongpassword",
    });

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject with wrong usenmae", async function () {
    const result = await supertest(web).post("/api/users/login").send({
      username: "wronguser",
      password: "wrongpassword",
    });

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
});

describe("GET /api/users/current", function () {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it("should can get current user", async () => {
    const result = await supertest(web)
      .get("/api/users/current")
      .set("Authorization", "token");

    console.log(result.body);
    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("test");
    expect(result.body.data.name).toBe("testuser");
  });

  it("should reject if token is invalid", async () => {
    const result = await supertest(web)
      .get("/api/users/current")
      .set("Authorization", "wrongtoken");

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
});
