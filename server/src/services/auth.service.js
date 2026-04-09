<<<<<<< HEAD
<<<<<<< HEAD
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import { env } from "../config/env.js";
import { readStore, writeStore } from "./data-store.js";
import { createHttpError } from "../utils/http-error.js";

function toSafeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function buildAuthResponse(user) {
  const token = jwt.sign(
    {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn },
  );

  return {
    user: toSafeUser(user),
    token,
  };
}

export async function registerUser(payload) {
  const store = await readStore();
  const email = payload.email.trim().toLowerCase();

  if (store.users.some((user) => user.email === email)) {
    throw createHttpError(409, "An account already exists with this email.", [
      { field: "email", message: "This email is already in use." },
    ]);
  }

  const timestamp = new Date().toISOString();
  const user = {
    id: randomUUID(),
    name: payload.name.trim(),
    email,
    passwordHash: await bcrypt.hash(payload.password, 12),
    role: "user",
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  store.users.push(user);
  await writeStore(store);

  return buildAuthResponse(user);
}

export async function loginUser(payload) {
  const store = await readStore();
  const email = payload.email.trim().toLowerCase();
  const user = store.users.find((entry) => entry.email === email);

  if (!user) {
    throw createHttpError(401, "Incorrect email or password.");
  }

  const isPasswordValid = await bcrypt.compare(payload.password, user.passwordHash);

  if (!isPasswordValid) {
    throw createHttpError(401, "Incorrect email or password.");
  }

  return buildAuthResponse(user);
}

export async function getCurrentUser(userId) {
  const store = await readStore();
  const user = store.users.find((entry) => entry.id === userId);

  if (!user) {
    throw createHttpError(404, "User not found.");
  }

  return toSafeUser(user);
=======
=======
>>>>>>> e91372e (initial commit)
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { readStore, updateStore } from "./data-store.js";
import { HttpError } from "../utils/http-error.js";

function buildPublicUser(user) {
  const { passwordHash, ...publicUser } = user;
  return publicUser;
}

function createToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      role: user.role,
      email: user.email,
      name: user.name,
    },
    env.jwtSecret,
    {
      expiresIn: env.jwtExpiresIn,
    },
  );
}

export async function ensureAdminUser() {
  let seededAdmin = null;

  const store = await updateStore(async (draftStore) => {
    const existingAdmin = draftStore.users.find(
      (user) => user.email === env.defaultAdminEmail,
    );

    if (existingAdmin) {
      seededAdmin = existingAdmin;
      return draftStore;
    }

    const timestamp = new Date().toISOString();
    const adminUser = {
      id: crypto.randomUUID(),
      name: "Eventify Admin",
      email: env.defaultAdminEmail,
      passwordHash: await bcrypt.hash(env.defaultAdminPassword, 12),
      role: "admin",
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    draftStore.users.push(adminUser);
    seededAdmin = adminUser;
    console.info(`Seeded default admin user: ${env.defaultAdminEmail}`);

    return draftStore;
  });

  if (seededAdmin) {
    return buildPublicUser(seededAdmin);
  }

  const existingAdmin = store.users.find((user) => user.email === env.defaultAdminEmail);
  return buildPublicUser(existingAdmin);
}

export async function registerUser(input) {
  const normalizedEmail = input.email.toLowerCase();
  let createdUser = null;

  await updateStore(async (store) => {
    const existingUser = store.users.find((user) => user.email === normalizedEmail);

    if (existingUser) {
      throw new HttpError(409, "An account with this email already exists.", {
        errors: [
          {
            field: "email",
            message: "An account with this email already exists.",
          },
        ],
      });
    }

    const timestamp = new Date().toISOString();
    createdUser = {
      id: crypto.randomUUID(),
      name: input.name,
      email: normalizedEmail,
      passwordHash: await bcrypt.hash(input.password, 12),
      role: "user",
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    store.users.push(createdUser);

    return store;
  });

  const user = createdUser;

  return {
    user: buildPublicUser(user),
    token: createToken(user),
  };
}

export async function loginUser(input) {
  const store = await readStore();
  const normalizedEmail = input.email.toLowerCase();
  const user = store.users.find((entry) => entry.email === normalizedEmail);

  if (!user) {
    throw new HttpError(401, "Invalid email or password.");
  }

  const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);

  if (!isPasswordValid) {
    throw new HttpError(401, "Invalid email or password.");
  }

  return {
    user: buildPublicUser(user),
    token: createToken(user),
  };
}

export async function getPublicUserById(userId) {
  const store = await readStore();
  const user = store.users.find((entry) => entry.id === userId);

  return user ? buildPublicUser(user) : null;
<<<<<<< HEAD
>>>>>>> e91372e (initial commit)
=======
>>>>>>> e91372e (initial commit)
}
