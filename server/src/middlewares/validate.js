export function validateBody(schema) {
  return async (req, _res, next) => {
    try {
      req.validatedBody = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
}
