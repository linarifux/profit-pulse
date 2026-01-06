import mongoose, { Schema } from "mongoose";

const transactionSchema = new Schema(
    {
        store: {
            type: Schema.Types.ObjectId,
            ref: "Store",
            required: true
        },
        externalId: {
            type: String, // Shopify Order ID
            required: true,
            index: true
        },
        orderName: {
            type: String // e.g. #1024
        },
        totalSales: {
            type: Number,
            required: true
        },
        netSales: {
            type: Number // total - tax - shipping
        },
        shippingCost: {
            type: Number, // What customer paid
            default: 0
        },
        handlingCost: {
            type: Number, // Actual cost to merchant (for profit calc)
            default: 0
        },
        cogs: {
            type: Number, // Cost of Goods Sold
            default: 0
        },
        paymentGatewayFee: {
            type: Number,
            default: 0
        },
        currency: {
            type: String,
            default: "USD"
        },
        financialStatus: {
            type: String, // paid, refunded, voided
            index: true
        },
        processedAt: {
            type: Date, // When the order actually happened
            required: true,
            index: true // crucial for date filtering on dashboard
        }
    },
    {
        timestamps: true
    }
);

export const Transaction = mongoose.model("Transaction", transactionSchema);