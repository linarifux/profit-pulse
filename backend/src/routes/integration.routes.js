import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { 
    generateAuthUrl, 
    handleCallback, 
    disconnectShopify 
} from "../controllers/shopify.controller.js";

const router = Router();

// Public route for Shopify Callback (Shopify can't pass your JWT)
router.get("/shopify/callback", handleCallback);

// Protected Routes
router.use(verifyJWT);

// Start the auth flow
router.get("/shopify/auth", generateAuthUrl);

// Disconnect
router.post("/shopify/disconnect", disconnectShopify);

// ... existing routes

export default router;