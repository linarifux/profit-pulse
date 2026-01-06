import mongoose, { Schema } from "mongoose";

const storeSchema = new Schema(
    {
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        domain: {
            type: String, // e.g., "my-brand.myshopify.com"
            required: true,
            unique: true
        },
        accessToken: {
            type: String, // Shopify Admin API Token (Encrypted)
            required: true
        },
        currency: {
            type: String,
            default: "USD"
        },
        timezone: {
            type: String,
            default: "UTC"
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

export const Store = mongoose.model("Store", storeSchema);