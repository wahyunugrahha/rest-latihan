import supertest from "supertest";
import { web } from "../application/web.js";
import { prismaClient } from "../application/database.js";
describe("POST /api/users", function () {
  afterEach(async () => {
    await prismaClient.user.deleteMany({
      where: {
        username: "test",
      },
    });
  });
  it("should can register user", async () => {
    const result = await supertest(web).post("/api/users").send({
      username: "test",
      password: "test",
      name: "test user",
    });
    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("test");
    expect(result.body.data.passowrd).toBeUndefined();
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
});
