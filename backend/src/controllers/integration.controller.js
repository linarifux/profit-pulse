import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Integration } from "../models/integration.model.js";
import { Store } from "../models/store.model.js";

// Helper: Ensure user has a store
const getOrCreateStore = async (userId) => {
    let store = await Store.findOne({ owner: userId });
    if (!store) {
        store = await Store.create({
            owner: userId,
            name: "My Demo Store",
            domain: `demo-${userId}.myshopify.com`,
            accessToken: "demo-token"
        });
    }
    return store;
};

const getIntegrations = asyncHandler(async (req, res) => {
    const store = await getOrCreateStore(req.user._id);
    
    const integrations = await Integration.find({ store: store._id });

    // Transform to simple key-value object for frontend (e.g., { shopify: true, meta: false })
    const connectedStatus = {
        shopify: false,
        meta: false,
        tiktok: false,
        google: false
    };

    integrations.forEach(int => {
        if (int.status === 'ACTIVE') {
            connectedStatus[int.provider.toLowerCase()] = true;
        }
    });

    return res.status(200).json(
        new ApiResponse(200, connectedStatus, "Integrations fetched successfully")
    );
});

const toggleIntegration = asyncHandler(async (req, res) => {
    const { provider } = req.body; // e.g., "shopify", "meta"
    const store = await getOrCreateStore(req.user._id);

    const providerUpper = provider.toUpperCase();

    // Check if exists
    const existing = await Integration.findOne({ 
        store: store._id, 
        provider: providerUpper 
    });

    let status;

    if (existing) {
        // Toggle Logic: If active, delete it (or set inactive). If inactive, activate.
        // For simplicity, we'll just delete it to "disconnect"
        await Integration.findByIdAndDelete(existing._id);
        status = false;
    } else {
        // Create new
        await Integration.create({
            store: store._id,
            provider: providerUpper,
            name: `${provider} Account`,
            credentials: { accessToken: "demo-token-123" }, // Mock credentials
            status: "ACTIVE"
        });
        status = true;
    }

    return res.status(200).json(
        new ApiResponse(200, { provider, isConnected: status }, `Integration ${status ? 'connected' : 'disconnected'}`)
    );
});

export { getIntegrations, toggleIntegration };