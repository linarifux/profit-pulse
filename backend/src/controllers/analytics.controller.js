import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Expense } from "../models/expense.model.js";
import { Store } from "../models/store.model.js";

const getAdPlatformStats = asyncHandler(async (req, res) => {
    const store = await Store.findOne({ owner: req.user._id });
    if (!store) throw new ApiError(404, "Store not found");

    // 1. Pie Chart Data: Total Spend per Platform
    const platformBreakdown = await Expense.aggregate([
        { $match: { store: store._id } },
        {
            $group: {
                _id: "$source", // Group by 'META', 'TIKTOK'
                totalSpend: { $sum: "$amount" }
            }
        }
    ]);

    // 2. Bar Chart Data: Daily Spend per Platform
    // We want output like: { date: '2023-10-01', META: 50, TIKTOK: 30 }
    const dailyTrend = await Expense.aggregate([
        { $match: { store: store._id } },
        {
            $group: {
                _id: {
                    date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                    source: "$source"
                },
                dailySpend: { $sum: "$amount" }
            }
        },
        { $sort: { "_id.date": 1 } }
    ]);

    // Transform Daily Trend for Recharts (Array of Objects)
    const trendMap = new Map();
    
    dailyTrend.forEach(item => {
        const date = item._id.date;
        const source = item._id.source;
        const spend = item.dailySpend;

        const existing = trendMap.get(date) || { date };
        existing[source] = spend; // e.g. { date: '...', META: 100 }
        trendMap.set(date, existing);
    });

    const graphData = Array.from(trendMap.values());

    return res.status(200).json(
        new ApiResponse(200, {
            pieData: platformBreakdown, // [{ _id: 'META', totalSpend: 1000 }]
            barData: graphData          // [{ date: '...', META: 100, TIKTOK: 50 }]
        }, "Analytics fetched successfully")
    );
});

export { getAdPlatformStats };