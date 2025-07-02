import supertest from "supertest";
import { web } from "../application/web.js";
import { createTestUser, removeTestUser, getTestUser } from "./test-util.js";
import bcrypt from "bcrypt";
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

describe("PATCH /api/users/current", function () {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it("should update current user", async () => {
    const result = await supertest(web)
      .patch("/api/users/current")
      .set("Authorization", "token")
      .send({
        name: "Updated User",
        password: "newpassword",
      });

    console.log(result.body);
    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("test");
    expect(result.body.data.name).toBe("Updated User");

    const user = getTestUser();
    expect(await bcrypt.compare("newpassword", (await user).password)).toBe(
      true
    );
  });

  it("should update current user name", async () => {
    const result = await supertest(web)
      .patch("/api/users/current")
      .set("Authorization", "token")
      .send({
        name: "Updated User",
      });
    console.log(result.body);
    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("test");
    expect(result.body.data.name).toBe("Updated User");
  });

  it("should update current user password", async () => {
    const result = await supertest(web)
      .patch("/api/users/current")
      .set("Authorization", "token")
      .send({
        password: "newpassword",
      });

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("test");
    expect(result.body.data.name).toBe("testuser");

    const user = getTestUser();
    expect(await bcrypt.compare("newpassword", (await user).password)).toBe(
      true
    );
  });

  it("should reject if request is invalid", async () => {
    const result = await supertest(web)
      .patch("/api/users/current")
      .set("Authorization", "invalidtoken")
      .send({});
    expect(result.status).toBe(401);
  });
});

describe("DELETE /api/user/logout", function () {
  beforeEach(async () => {
    await createTestUser();
  });
  afterEach(async () => {
    await removeTestUser();
  });

  it("should can logout", async () => {
    const result = await supertest(web)
      .delete("/api/users/logout")
      .set("Authorization", "token");

    expect(result.status).toBe(200);
    expect(result.body.data).toBe("OK");

    const user = getTestUser();
    expect(user.token).toBeNull;
  });

  it("should reject if invalid token", async () => {
    const result = await supertest(web)
      .delete("/api/users/logout")
      .set("Authorization", "wrongtoken");

    expect(result.status).toBe(401);
  });
});
afterAll(async () => {
  await prismaClient.$disconnect();
});
