const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { randomUUID } = require("crypto");

const { jwtSecret, jwtExpiresIn } = require("../config/env");
const { readStore, updateStore } = require("../utils/fileDb");
const { HttpError } = require("../utils/httpError");

function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    tenantId: user.tenantId,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function signToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      tenantId: user.tenantId,
      name: user.name,
    },
    jwtSecret,
    { expiresIn: jwtExpiresIn }
  );
}

async function registerUser(payload) {
  const normalizedEmail = payload.email.trim().toLowerCase();
  const now = new Date().toISOString();
  const passwordHash = await bcrypt.hash(payload.password, 10);

  let createdUser;

  await updateStore(async (state) => {
    const existingUser = state.users.find((user) => user.email === normalizedEmail);

    if (existingUser) {
      throw new HttpError(409, "User with this email already exists");
    }

    createdUser = {
      id: randomUUID(),
      name: payload.name.trim(),
      email: normalizedEmail,
      passwordHash,
      tenantId: payload.tenantId.trim(),
      createdAt: now,
      updatedAt: now,
    };

    state.users.push(createdUser);
    return state;
  });

  return {
    user: sanitizeUser(createdUser),
    token: signToken(createdUser),
  };
}

async function loginUser(payload) {
  const normalizedEmail = payload.email.trim().toLowerCase();
  const state = await readStore();
  const user = state.users.find((entry) => entry.email === normalizedEmail);

  if (!user) {
    throw new HttpError(401, "Invalid credentials");
  }

  const passwordMatches = await bcrypt.compare(payload.password, user.passwordHash);

  if (!passwordMatches) {
    throw new HttpError(401, "Invalid credentials");
  }

  return {
    user: sanitizeUser(user),
    token: signToken(user),
  };
}

module.exports = {
  registerUser,
  loginUser,
};
