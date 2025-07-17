import supertest from "supertest";
import { web } from "../application/web.js";
import {
  createTestUser,
  removeTestUser,
  getTestUser,
  getAuthToken,
} from "./test-util.js";
import bcrypt from "bcrypt";

describe("POST /api/users", () => {
  afterEach(removeTestUser);

  it("should register user", async () => {
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

  it("should reject if input is invalid", async () => {
    const result = await supertest(web).post("/api/users").send({
      username: "",
      password: "",
      name: "",
    });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if username is already registered", async () => {
    await supertest(web).post("/api/users").send({
      username: "test",
      password: "testpassword",
      name: "test",
    });

    const result = await supertest(web).post("/api/users").send({
      username: "test",
      password: "testpassword",
      name: "test",
    });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});

describe("POST /api/users/login", () => {
  beforeEach(createTestUser);
  afterEach(removeTestUser);

  it("should login with valid credentials", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      username: "test",
      password: "testpassword",
    });

    expect(result.status).toBe(200);
    expect(result.body.data.token).toBeDefined();
    expect(result.body.data.token).not.toBe("token");
  });

  it("should reject with invalid credentials", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      username: "",
      password: "",
    });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject with wrong password", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      username: "test",
      password: "wrongpassword",
    });

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject with wrong username", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      username: "wronguser",
      password: "wrongpassword",
    });

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
});

describe("GET /api/users/current", () => {
  let token;

  beforeEach(async () => {
    await createTestUser();
    token = await getAuthToken();
  });

  afterEach(removeTestUser);

  it("should get current user", async () => {
    const result = await supertest(web)
      .get("/api/users/current")
      .set("Authorization", `Bearer ${token}`);

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("test");
    expect(result.body.data.name).toBe("testuser");
  });

  it("should reject if token is invalid", async () => {
    const result = await supertest(web)
      .get("/api/users/current")
      .set("Authorization", "Bearer wrongtoken");

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
});

describe("PATCH /api/users/current", () => {
  let token;

  beforeEach(async () => {
    await createTestUser();
    token = await getAuthToken();
  });

  afterEach(removeTestUser);

  it("should update name and password", async () => {
    const result = await supertest(web)
      .patch("/api/users/current")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Updated User",
        password: "newpassword",
      });

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("test");
    expect(result.body.data.name).toBe("Updated User");

    const user = await getTestUser();
    expect(await bcrypt.compare("newpassword", user.password)).toBe(true);
  });

  it("should update only name", async () => {
    const result = await supertest(web)
      .patch("/api/users/current")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Updated User" });

    expect(result.status).toBe(200);
    expect(result.body.data.name).toBe("Updated User");
  });

  it("should update only password", async () => {
    const result = await supertest(web)
      .patch("/api/users/current")
      .set("Authorization", `Bearer ${token}`)
      .send({ password: "newpassword" });

    expect(result.status).toBe(200);

    const user = await getTestUser();
    expect(await bcrypt.compare("newpassword", user.password)).toBe(true);
  });

  it("should reject if token is invalid", async () => {
    const result = await supertest(web)
      .patch("/api/users/current")
      .set("Authorization", "Bearer invalidtoken")
      .send({});
    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
});

describe("DELETE /api/users/logout", () => {
  let token;

  beforeEach(async () => {
    await createTestUser();
    token = await getAuthToken();
  });

  afterEach(removeTestUser);

  it("should logout", async () => {
    const result = await supertest(web)
      .delete("/api/users/logout")
      .set("Authorization", `Bearer ${token}`);

    expect(result.status).toBe(200);
    expect(result.body.data).toBe("OK");

  });

  it("should reject if token is invalid", async () => {
    const result = await supertest(web)
      .delete("/api/users/logout")
      .set("Authorization", "Bearer wrongtoken");

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
});
