export function validateBody(schema) {
<<<<<<< HEAD
<<<<<<< HEAD
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const error = new Error("Please check the highlighted fields.");
      error.statusCode = 400;
      error.errors = result.error.issues.map((issue) => ({
        field: issue.path[0],
        message: issue.message,
      }));
      next(error);
      return;
    }

    req.validatedBody = result.data;
    next();
=======
=======
>>>>>>> e91372e (initial commit)
  return async (req, _res, next) => {
    try {
      req.validatedBody = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      next(error);
    }
<<<<<<< HEAD
>>>>>>> e91372e (initial commit)
=======
>>>>>>> e91372e (initial commit)
  };
}
