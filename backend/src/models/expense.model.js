import mongoose, { Schema } from "mongoose";

const expenseSchema = new Schema(
    {
        store: {
            type: Schema.Types.ObjectId,
            ref: "Store",
            required: true
        },
        integration: {
            type: Schema.Types.ObjectId,
            ref: "Integration" // Link to the specific ad account
        },
        source: {
            type: String,
            enum: ["META", "TIKTOK", "GOOGLE", "CUSTOM", "SUBSCRIPTION"],
            required: true
        },
        date: {
            type: Date, // The day this spend occurred
            required: true,
            index: true
        },
        amount: {
            type: Number,
            required: true
        },
        impressions: {
            type: Number,
            default: 0
        },
        clicks: {
            type: Number,
            default: 0
        },
        campaignName: {
            type: String // Optional: if you want breakdown by campaign
        },
        currency: {
            type: String,
            default: "USD"
        }
    },
    {
        timestamps: true
    }
);

export const Expense = mongoose.model("Expense", expenseSchema);