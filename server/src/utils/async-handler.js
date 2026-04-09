export function asyncHandler(handler) {
<<<<<<< HEAD
<<<<<<< HEAD
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      next(error);
    }
=======
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
>>>>>>> e91372e (initial commit)
=======
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
>>>>>>> e91372e (initial commit)
  };
}
