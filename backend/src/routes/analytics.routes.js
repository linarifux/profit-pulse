import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getAdPlatformStats } from "../controllers/analytics.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/platforms").get(getAdPlatformStats);

export default router;