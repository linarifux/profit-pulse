import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "./models/user.model.js";
import { Store } from "./models/store.model.js";
import { Transaction } from "./models/transaction.model.js";
import { Expense } from "./models/expense.model.js";
import { Integration } from "./models/integration.model.js";

dotenv.config({ path: "./.env" });

const seedData = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/profitpulse`);
        console.log("🌱 Connected to DB for Seeding...");

        // 1. Find the first user (YOU)
        const user = await User.findOne();
        if (!user) {
            console.log("❌ No user found. Please register a user via the Frontend first.");
            process.exit(1);
        }
        console.log(`👤 Seeding data for user: ${user.username}`);

        // 2. Find or Create Store
        let store = await Store.findOne({ owner: user._id });
        if (!store) {
            store = await Store.create({
                owner: user._id,
                name: "My Demo Brand",
                domain: "demo-brand.myshopify.com",
                accessToken: "mock-token",
            });
            console.log("🏪 Created Demo Store");
        }

        // 3. Ensure Integrations exist
        const providers = ["SHOPIFY", "META", "TIKTOK"];
        for (const provider of providers) {
            const exists = await Integration.findOne({ store: store._id, provider });
            if (!exists) {
                await Integration.create({
                    store: store._id,
                    provider,
                    status: "ACTIVE",
                    name: `${provider} Account`
                });
            }
        }

        // 4. Clear Old Data (Optional - keeps it clean)
        await Transaction.deleteMany({ store: store._id });
        await Expense.deleteMany({ store: store._id });
        console.log("🧹 Cleared old transactions and expenses");

        // 5. Generate 30 Days of Data
        const transactions = [];
        const expenses = [];
        const today = new Date();

        for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            date.setHours(12, 0, 0, 0); // Mid-day

            // Randomize Daily Volume
            // Weekend multiplier (more sales on weekends)
            const isWeekend = date.getDay() === 0 || date.getDay() === 6;
            const volumeMultiplier = isWeekend ? 1.5 : 1.0;
            const orderCount = Math.floor((Math.random() * 20 + 10) * volumeMultiplier); 

            // A. Generate Orders (Transactions)
            for (let j = 0; j < orderCount; j++) {
                const orderTotal = parseFloat((Math.random() * 100 + 40).toFixed(2)); // $40 - $140 order
                const cogs = parseFloat((orderTotal * 0.3).toFixed(2)); // 30% product cost
                const shipping = 9.99;
                
                transactions.push({
                    store: store._id,
                    externalId: `ORD-${date.getTime()}-${j}`,
                    orderName: `#${1000 + i * 100 + j}`,
                    totalSales: orderTotal,
                    netSales: orderTotal - shipping,
                    shippingCost: shipping,
                    cogs: cogs,
                    paymentGatewayFee: parseFloat((orderTotal * 0.029 + 0.30).toFixed(2)), // Stripe fee
                    financialStatus: "paid",
                    processedAt: date
                });
            }

            // B. Generate Ad Spend (Expenses)
            // Ads usually correlate with sales somewhat
            const dailyAdSpend = orderCount * (Math.random() * 15 + 10); // $10-$25 CPA
            
            // Meta Spend (70% of budget)
            expenses.push({
                store: store._id,
                source: "META",
                date: date,
                amount: parseFloat((dailyAdSpend * 0.7).toFixed(2)),
                currency: "USD"
            });

            // TikTok Spend (30% of budget)
            expenses.push({
                store: store._id,
                source: "TIKTOK",
                date: date,
                amount: parseFloat((dailyAdSpend * 0.3).toFixed(2)),
                currency: "USD"
            });
        }

        await Transaction.insertMany(transactions);
        await Expense.insertMany(expenses);

        console.log(`✅ Successfully seeded:`);
        console.log(`   - ${transactions.length} Transactions`);
        console.log(`   - ${expenses.length} Daily Expense Records`);
        console.log("🚀 Your Dashboard is ready!");

        process.exit();

    } catch (error) {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    }
};

seedData();