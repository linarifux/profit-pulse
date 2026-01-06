import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getIntegrations, toggleIntegration } from "../controllers/integration.controller.js";

const router = Router();

router.use(verifyJWT); // Protect all routes

router.route("/").get(getIntegrations);
router.route("/toggle").post(toggleIntegration);

export default router;