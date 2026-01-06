import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getDashboardStats } from "../controllers/dashboard.controller.js";

const router = Router();

// Apply auth middleware to all routes in this file
router.use(verifyJWT);

// Route: /api/v1/dashboard/:storeId/stats?startDate=...&endDate=...
router.route("/stats").get(getDashboardStats);

export default router;