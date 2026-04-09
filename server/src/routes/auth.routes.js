import { Router } from "express";
import { authenticate } from "../middlewares/auth.js";
import { validateBody } from "../middlewares/validate.js";
import { getCurrentUser, loginUser, registerUser } from "../services/auth.service.js";
import { asyncHandler } from "../utils/async-handler.js";
import { loginSchema, registerSchema } from "../validators/auth.schemas.js";

const router = Router();

router.post(
  "/register",
  validateBody(registerSchema),
  asyncHandler(async (req, res) => {
    const result = await registerUser(req.validatedBody);

    res.status(201).json({
      success: true,
      message: "Account created successfully.",
      data: result,
    });
  }),
);

router.post(
  "/login",
  validateBody(loginSchema),
  asyncHandler(async (req, res) => {
    const result = await loginUser(req.validatedBody);

    res.status(200).json({
      success: true,
      message: "Signed in successfully.",
      data: result,
    });
  }),
);

router.get(
  "/me",
  authenticate,
  asyncHandler(async (req, res) => {
    const user = await getCurrentUser(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        user,
      },
    });
  }),
);

export default router;
