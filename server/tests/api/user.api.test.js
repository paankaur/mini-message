import express from "express";
import request from "supertest";
import sequelize from "../../util/db.js";
import userRoutes from "../../routes/user.js";
import User from "../../models/user.js";

describe("User API tests", () => {
  let app;

  beforeAll(async () => {
    await sequelize.sync({ force: true });
    app = express();
    app.use(express.json());
    app.use("/", userRoutes);
  });

  beforeEach(async () => {
    await User.destroy({ where: {}, truncate: true, cascade: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test("POST /register creates a user and returns 200", async () => {
    const res = await request(app)
      .post("/register")
      .send({ name: "alice", password: "password123" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "User registered successfully");
    expect(res.body.user).toHaveProperty("id");
    expect(res.body.user).toHaveProperty("name", "alice");
  });

  test("POST /register returns 409 for duplicate user", async () => {
    await request(app).post("/register").send({ name: "bob", password: "password123" });
    const res = await request(app).post("/register").send({ name: "bob", password: "otherpass" });
    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty("message");
  });

  test("POST /login returns 200 on success and 401 on bad credentials", async () => {
    await request(app).post("/register").send({ name: "carol", password: "mypassword" });

    const ok = await request(app).post("/login").send({ name: "carol", password: "mypassword" });
    expect(ok.status).toBe(200);
    expect(ok.body).toHaveProperty("message", "Login successful");

    const bad = await request(app).post("/login").send({ name: "carol", password: "wrong" });
    expect(bad.status).toBe(401);
    expect(bad.body).toHaveProperty("message", "Invalid credentials.");
  });

  test("PUT /change-password updates password on correct old password", async () => {
    const reg = await request(app).post("/register").send({ name: "dave", password: "oldpass123" });
    const userId = reg.body.user.id;

    const change = await request(app).put("/change-password").send({ userId, oldPassword: "oldpass123", newPassword: "newpass456" });
    expect(change.status).toBe(200);
    expect(change.body).toHaveProperty("message", "Password changed successfully");

    // Verify login with new password
    const loginNew = await request(app).post("/login").send({ name: "dave", password: "newpass456" });
    expect(loginNew.status).toBe(200);
  });

  test("PUT /change-password returns 404 for wrong old password or missing user", async () => {
    const reg = await request(app).post("/register").send({ name: "erin", password: "origpass" });
    const userId = reg.body.user.id;

    const wrongOld = await request(app).put("/change-password").send({ userId, oldPassword: "badold", newPassword: "newpass" });
    expect(wrongOld.status).toBe(404);

    const missing = await request(app).put("/change-password").send({ userId: 99999, oldPassword: "whatever", newPassword: "newpass" });
    expect(missing.status).toBe(404);
  });
});
