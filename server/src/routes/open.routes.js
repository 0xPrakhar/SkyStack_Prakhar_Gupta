import { Router } from "express";
import { z } from "zod";
import { getOpenWeather } from "../services/open-data.service.js";
import { asyncHandler } from "../utils/async-handler.js";

const router = Router();
const weatherQuerySchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
});

router.get(
  "/weather",
  asyncHandler(async (req, res) => {
    const query = weatherQuerySchema.parse(req.query);
    const weather = await getOpenWeather({
      latitude: query.lat,
      longitude: query.lng,
    });

    res.status(200).json({
      success: true,
      data: {
        weather,
      },
    });
  }),
);

export default router;
