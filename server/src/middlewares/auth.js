import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
<<<<<<< HEAD
<<<<<<< HEAD
import { createHttpError } from "../utils/http-error.js";

export function authenticate(req, _res, next) {
  const authorization = req.headers.authorization ?? "";
  const token = authorization.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : null;

  if (!token) {
    next(createHttpError(401, "Authentication required."));
    return;
  }

  try {
    req.user = jwt.verify(token, env.jwtSecret);
    next();
  } catch (_error) {
    next(createHttpError(401, "Your session is no longer valid. Please sign in again."));
  }
}
=======
=======
>>>>>>> e91372e (initial commit)
import { getPublicUserById } from "../services/auth.service.js";
import { HttpError } from "../utils/http-error.js";

export async function authenticate(req, _res, next) {
  try {
    const authorization = req.headers.authorization ?? "";
    const token = authorization.startsWith("Bearer ")
      ? authorization.slice(7)
      : null;

    if (!token) {
      throw new HttpError(401, "Authentication required.");
    }

    const payload = jwt.verify(token, env.jwtSecret);
    const user = await getPublicUserById(payload.sub);

    if (!user) {
      throw new HttpError(401, "Your session is no longer valid.");
    }

    req.auth = payload;
    req.user = user;
    next();
  } catch (error) {
    const authError =
      error instanceof HttpError
        ? error
        : new HttpError(401, "Invalid or expired authentication token.");

    next(authError);
  }
}

export function authorizeRoles(...allowedRoles) {
  return (req, _res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      next(new HttpError(403, "You do not have permission to perform this action."));
      return;
    }

    next();
  };
}
<<<<<<< HEAD
>>>>>>> e91372e (initial commit)
=======
>>>>>>> e91372e (initial commit)
