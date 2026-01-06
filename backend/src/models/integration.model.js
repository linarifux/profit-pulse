import mongoose, { Schema } from "mongoose";

const integrationSchema = new Schema(
    {
        store: {
            type: Schema.Types.ObjectId,
            ref: "Store",
            required: true
        },
        provider: {
            type: String,
            enum: ["META", "TIKTOK", "GOOGLE", "SHOPIFY"], // Expandable
            required: true
        },
        name: {
            type: String, // e.g., "Main FB Ad Account"
        },
        credentials: {
            // Flexible object to store provider-specific keys
            accessToken: String,
            refreshToken: String,
            adAccountId: String, // Specifically which ad account to track
            pixelId: String
        },
        status: {
            type: String,
            enum: ["ACTIVE", "EXPIRED", "ERROR"],
            default: "ACTIVE"
        },
        lastSync: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

// Ensure a store only has one integration per provider (optional, depending on logic)
// integrationSchema.index({ store: 1, provider: 1 }, { unique: true });

export const Integration = mongoose.model("Integration", integrationSchema);