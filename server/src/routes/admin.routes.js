import { Router } from "express";
import { authenticate, authorizeRoles } from "../middlewares/auth.js";
import { getAdminOverview } from "../services/admin.service.js";
import { asyncHandler } from "../utils/async-handler.js";

const router = Router();

router.use(authenticate, authorizeRoles("admin"));

router.get(
  "/overview",
  asyncHandler(async (_req, res) => {
    const overview = await getAdminOverview();

    res.status(200).json({
      success: true,
      data: overview,
    });
  }),
);

export default router;
