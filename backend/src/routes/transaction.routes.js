import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getTransactions } from "../controllers/transaction.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/").get(getTransactions);

export default router;