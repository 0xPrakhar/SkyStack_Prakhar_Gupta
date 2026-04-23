import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import request from "supertest";

let app;
let tempDirectory;

test.before(async () => {
  tempDirectory = await mkdtemp(path.join(os.tmpdir(), "eventify-tests-"));

  process.env.NODE_ENV = "test";
  process.env.CLIENT_URLS = "http://localhost:5173,http://127.0.0.1:5173";
  process.env.CLIENT_URL = "http://localhost:5173";
  process.env.DATABASE_URL = "";
  process.env.JWT_SECRET = "eventify-test-secret";
  process.env.JWT_EXPIRES_IN = "7d";
  process.env.DEFAULT_ADMIN_EMAIL = "admin@test.local";
  process.env.DEFAULT_ADMIN_PASSWORD = "Admin1234";
  process.env.STORAGE_FILE_PATH = path.join(tempDirectory, "store.json");

  const [{ default: loadedApp }, dataStoreModule, authServiceModule] = await Promise.all([
    import("../src/app.js"),
    import("../src/services/data-store.js"),
    import("../src/services/auth.service.js"),
  ]);

  app = loadedApp;

  await dataStoreModule.initializeDataStore();
  await authServiceModule.ensureAdminUser();
});

test.after(async () => {
  if (tempDirectory) {
    await rm(tempDirectory, { recursive: true, force: true });
  }
});

test(
  "blocks guest access and enforces admin authorization",
  { concurrency: false },
  async () => {
    await request(app).get("/api/admin/overview").expect(401);
    await request(app)
      .post("/api/bookings")
      .send({ eventId: "missing", ticketCount: 1 })
      .expect(401);

    const registerResponse = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: "user@test.local",
        password: "Password1",
      })
      .expect(201);

    const userToken = registerResponse.body.data.token;

    await request(app)
      .get("/api/admin/overview")
      .set("Authorization", `Bearer ${userToken}`)
      .expect(403);

    const adminLoginResponse = await request(app)
      .post("/api/auth/login")
      .send({
        email: "admin@test.local",
        password: "Admin1234",
      })
      .expect(200);

    const adminToken = adminLoginResponse.body.data.token;
    const adminOverviewResponse = await request(app)
      .get("/api/admin/overview")
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);

    assert.ok(adminOverviewResponse.body.data.stats.activeEvents > 0);
    assert.equal(adminOverviewResponse.body.data.stats.registeredUsers, 2);
  },
);

test(
  "supports event search and authenticated booking flow",
  { concurrency: false },
  async () => {
    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({
        email: "user@test.local",
        password: "Password1",
      })
      .expect(200);

    const userToken = loginResponse.body.data.token;
    const searchResponse = await request(app)
      .get("/api/events")
      .query({
        city: "Mumbai",
        search: "Afterglow",
      })
      .expect(200);

    assert.equal(searchResponse.body.data.events.length, 1);
    assert.equal(typeof searchResponse.body.data.events[0].lat, "number");
    assert.equal(typeof searchResponse.body.data.events[0].lng, "number");

    const eventId = searchResponse.body.data.events[0].id;
    const bookingResponse = await request(app)
      .post("/api/bookings")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        eventId,
        ticketCount: 2,
      })
      .expect(201);

    assert.equal(bookingResponse.body.data.booking.ticketCount, 2);
    assert.ok(bookingResponse.body.data.booking.bookingCode.startsWith("EV-"));

    const myBookingsResponse = await request(app)
      .get("/api/bookings/me")
      .set("Authorization", `Bearer ${userToken}`)
      .expect(200);

    assert.equal(myBookingsResponse.body.data.bookings.length, 1);
    assert.equal(myBookingsResponse.body.data.bookings[0].eventId, eventId);
  },
);
