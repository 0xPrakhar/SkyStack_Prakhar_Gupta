import { Router } from "express";
import { authenticate } from "../middlewares/auth.js";
import { validateBody } from "../middlewares/validate.js";
<<<<<<< HEAD
<<<<<<< HEAD
import { asyncHandler } from "../utils/async-handler.js";
import { loginUser, registerUser, getCurrentUser } from "../services/auth.service.js";
=======
=======
>>>>>>> e91372e (initial commit)
import {
  loginUser,
  registerUser,
} from "../services/auth.service.js";
import { asyncHandler } from "../utils/async-handler.js";
<<<<<<< HEAD
>>>>>>> e91372e (initial commit)
=======
>>>>>>> e91372e (initial commit)
import { loginSchema, registerSchema } from "../validators/auth.schemas.js";

const router = Router();

router.post(
  "/register",
  validateBody(registerSchema),
  asyncHandler(async (req, res) => {
<<<<<<< HEAD
<<<<<<< HEAD
    const data = await registerUser(req.validatedBody);
    res.status(201).json({ success: true, message: "Account created successfully.", data });
=======
=======
>>>>>>> e91372e (initial commit)
    const result = await registerUser(req.validatedBody);

    res.status(201).json({
      success: true,
      message: "Account created successfully.",
      data: result,
    });
<<<<<<< HEAD
>>>>>>> e91372e (initial commit)
=======
>>>>>>> e91372e (initial commit)
  }),
);

router.post(
  "/login",
  validateBody(loginSchema),
  asyncHandler(async (req, res) => {
<<<<<<< HEAD
<<<<<<< HEAD
    const data = await loginUser(req.validatedBody);
    res.status(200).json({ success: true, message: "Signed in successfully.", data });
=======
=======
>>>>>>> e91372e (initial commit)
    const result = await loginUser(req.validatedBody);

    res.status(200).json({
      success: true,
      message: "Signed in successfully.",
      data: result,
    });
<<<<<<< HEAD
>>>>>>> e91372e (initial commit)
=======
>>>>>>> e91372e (initial commit)
  }),
);

router.get(
  "/me",
  authenticate,
  asyncHandler(async (req, res) => {
<<<<<<< HEAD
<<<<<<< HEAD
    const user = await getCurrentUser(req.user.sub);
    res.status(200).json({ success: true, data: { user } });
=======
=======
>>>>>>> e91372e (initial commit)
    res.status(200).json({
      success: true,
      data: {
        user: req.user,
      },
    });
<<<<<<< HEAD
>>>>>>> e91372e (initial commit)
=======
>>>>>>> e91372e (initial commit)
  }),
);

export default router;
