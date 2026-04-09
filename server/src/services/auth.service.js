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
  return existingAdmin ? buildPublicUser(existingAdmin) : null;
}

export async function registerUser(input) {
  const normalizedEmail = input.email.trim().toLowerCase();
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
      name: input.name.trim(),
      email: normalizedEmail,
      passwordHash: await bcrypt.hash(input.password, 12),
      role: "user",
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    store.users.push(createdUser);

    return store;
  });

  return {
    user: buildPublicUser(createdUser),
    token: createToken(createdUser),
  };
}

export async function loginUser(input) {
  const store = await readStore();
  const normalizedEmail = input.email.trim().toLowerCase();
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

export async function getCurrentUser(userId) {
  const store = await readStore();
  const user = store.users.find((entry) => entry.id === userId);

  if (!user) {
    throw new HttpError(404, "User not found.");
  }

  return buildPublicUser(user);
}

export async function getPublicUserById(userId) {
  const store = await readStore();
  const user = store.users.find((entry) => entry.id === userId);

  return user ? buildPublicUser(user) : null;
}
