<<<<<<< HEAD
<<<<<<< HEAD
export function errorHandler(error, req, res, _next) {
=======
=======
>>>>>>> e91372e (initial commit)
import { ZodError } from "zod";

export function errorHandler(error, req, res, _next) {
  void req;

  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors: error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }

<<<<<<< HEAD
>>>>>>> e91372e (initial commit)
=======
>>>>>>> e91372e (initial commit)
  const statusCode = error.statusCode ?? 500;
  const message =
    statusCode >= 500 ? "Something went wrong on the server." : error.message;

  if (statusCode >= 500) {
    console.error(error);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(error.errors ? { errors: error.errors } : {}),
  });
}
