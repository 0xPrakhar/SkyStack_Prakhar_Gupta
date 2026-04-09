<<<<<<< HEAD
<<<<<<< HEAD
export function createHttpError(statusCode, message, errors) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.errors = errors;
  return error;
=======
=======
>>>>>>> e91372e (initial commit)
export class HttpError extends Error {
  constructor(statusCode, message, options = {}) {
    super(message);
    this.name = "HttpError";
    this.statusCode = statusCode;
    this.errors = options.errors;
  }
<<<<<<< HEAD
>>>>>>> e91372e (initial commit)
=======
>>>>>>> e91372e (initial commit)
}
