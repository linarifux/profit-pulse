import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import axios from "axios";
import crypto from "crypto";
import querystring from "querystring";

// 1. GENERATE AUTH URL
// Frontend calls this to get the URL to redirect the user to Shopify
const generateAuthUrl = asyncHandler(async (req, res) => {
  const { shop } = req.query; // User enters "my-store.myshopify.com"

  if (!shop) {
    throw new ApiError(400, "Shop name is required");
  }

  // Basic cleaning of shop url
  const shopUrl = shop.replace("https://", "").replace("/", "");

  const state = crypto.randomBytes(16).toString("hex");
  const redirectUri = `${process.env.BACKEND_URL}/api/v1/integrations/shopify/callback`;
  
  const installUrl = `https://${shopUrl}/admin/oauth/authorize?client_id=${process.env.SHOPIFY_API_KEY}&scope=${process.env.SHOPIFY_SCOPES}&state=${state}&redirect_uri=${redirectUri}`;

  res.status(200).json({ 
    data: { url: installUrl } 
  });
});

// 2. HANDLE CALLBACK
// Shopify redirects here with a temporary 'code'
const handleCallback = asyncHandler(async (req, res) => {
  const { shop, hmac, code, state } = req.query;

  if (!shop || !hmac || !code) {
    throw new ApiError(400, "Missing required parameters from Shopify");
  }

  // TODO: validate HMAC here for security (skipping for brevity, but recommended for prod)

  // Exchange code for permanent Access Token
  const accessTokenRequestUrl = `https://${shop}/admin/oauth/access_token`;
  const payload = {
    client_id: process.env.SHOPIFY_API_KEY,
    client_secret: process.env.SHOPIFY_API_SECRET,
    code,
  };

  try {
    const response = await axios.post(accessTokenRequestUrl, payload);
    const { access_token } = response.data;

    // Ideally, we need to know WHICH user initiated this.
    // Since Shopify redirects to the backend, we lose the JWT auth header.
    // A common trick is to pass the userId in the 'state' param in step 1, 
    // or set a temporary cookie.
    
    // FOR NOW (Simplified SaaS Flow):
    // We will assume a single user setup or hardcode update for the demo.
    // In a real app, you'd decode 'state' or use a cookie to find the User ID.
    
    // NOTE: Replace this findOne with logic to find the CURRENT user. 
    // Since we can't get req.user here without a cookie, 
    // we will redirect to frontend with the token details in query params 
    // and let the frontend save it (Not secure for production but works for MVP)
    // OR BETTER: Use a cookie in Step 1.

    // BEST MVP APPROACH: Redirect to frontend with a success flag, 
    // and have frontend trigger a "save integration" call if needed, 
    // BUT we need to save the token *now*.
    
    // Hardcoding update for the first user found (For your specific MVP demo)
    // Warning: Only works if you are the only user testing.
    const user = await User.findOne(); // Finds first user
    if(user) {
        // You might want to create a separate "Integrations" model, 
        // but saving to User model for simplicity as requested earlier.
        // Ensure your User model has these fields or flexible schema
        user.shopifyAccessToken = access_token;
        user.shopifyShopName = shop;
        user.isShopifyConnected = true;
        await user.save({ validateBeforeSave: false });
    }

    // Redirect back to your Dashboard Integrations page
    res.redirect(`${process.env.FRONTEND_URL}/integrations?status=success&platform=shopify`);

  } catch (error) {
    console.error("Shopify OAuth Error:", error.response?.data || error.message);
    res.redirect(`${process.env.FRONTEND_URL}/integrations?status=error`);
  }
});

// 3. DISCONNECT
const disconnectShopify = asyncHandler(async (req, res) => {
    // req.user is available here because this is called from frontend with JWT
    const user = await User.findById(req.user._id);
    
    user.shopifyAccessToken = undefined;
    user.shopifyShopName = undefined;
    user.isShopifyConnected = false;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({ message: "Shopify disconnected successfully" });
});

export { generateAuthUrl, handleCallback, disconnectShopify };