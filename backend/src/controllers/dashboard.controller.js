import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Transaction } from "../models/transaction.model.js";
import { Expense } from "../models/expense.model.js";
import { Store } from "../models/store.model.js";

const getDashboardStats = asyncHandler(async (req, res) => {
    const store = await Store.findOne({ owner: req.user._id });
    if (!store) throw new ApiError(404, "No store found");

    const storeId = store._id;
    const { startDate, endDate, timeframe = 'daily' } = req.query;

    // 1. Date Logic
    let start = startDate ? new Date(startDate) : new Date();
    let end = endDate ? new Date(endDate) : new Date();
    
    if (!startDate) {
        if (timeframe === 'monthly') start.setMonth(start.getMonth() - 12);
        else if (timeframe === 'weekly') start.setDate(start.getDate() - 90);
        else start.setDate(start.getDate() - 30);
    }
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    let dateFormat;
    switch (timeframe) {
        case 'monthly': dateFormat = "%Y-%m"; break;
        case 'weekly': dateFormat = "%Y-%U"; break;
        default: dateFormat = "%Y-%m-%d";
    }

    // 2. AGGREGATE REVENUE
    const revenueStats = await Transaction.aggregate([
        { 
            $match: {
                store: storeId,
                processedAt: { $gte: start, $lte: end },
                financialStatus: "paid"
            }
        },
        {
            $group: {
                _id: { $dateToString: { format: dateFormat, date: "$processedAt" } },
                revenue: { $sum: "$totalSales" },
                cogs: { $sum: "$cogs" },
                shipping: { $sum: "$shippingCost" },
                transactionFees: { $sum: "$paymentGatewayFee" },
                handling: { $sum: "$handlingCost" },
                orders: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    // 3. AGGREGATE EXPENSES
    const expenseStats = await Expense.aggregate([
        { 
            $match: {
                store: storeId,
                date: { $gte: start, $lte: end }
            }
        },
        {
            $group: {
                _id: { $dateToString: { format: dateFormat, date: "$date" } },
                adSpend: { $sum: "$amount" }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    // 4. CHANNEL SPEND
    const adSpendByChannel = await Expense.aggregate([
        { 
            $match: { store: storeId, date: { $gte: start, $lte: end } }
        },
        {
            $group: { _id: "$source", value: { $sum: "$amount" } }
        },
        { $sort: { value: -1 } }
    ]);

    // 5. MERGE DATA & CALCULATE DAILY METRICS
    const dataMap = new Map();
    let totalRevenue = 0, totalCOGS = 0, totalAdSpend = 0, totalShipping = 0, totalFees = 0, totalHandling = 0, totalOrders = 0;

    revenueStats.forEach(stat => {
        dataMap.set(stat._id, {
            date: stat._id,
            revenue: stat.revenue || 0,
            cogs: stat.cogs || 0,
            shipping: stat.shipping || 0,
            fees: stat.transactionFees || 0,
            handling: stat.handling || 0,
            orders: stat.orders || 0,
            adSpend: 0
        });
        totalRevenue += stat.revenue;
        totalCOGS += stat.cogs;
        totalShipping += stat.shipping;
        totalFees += stat.transactionFees;
        totalHandling += stat.handling;
        totalOrders += stat.orders;
    });

    expenseStats.forEach(stat => {
        const existing = dataMap.get(stat._id) || { date: stat._id, revenue: 0, cogs: 0, shipping: 0, fees: 0, handling: 0, orders: 0 };
        existing.adSpend = stat.adSpend || 0;
        dataMap.set(stat._id, existing);
        totalAdSpend += stat.adSpend;
    });

    const graphData = Array.from(dataMap.values()).sort((a, b) => a.date.localeCompare(b.date));

    // Daily Metrics
    graphData.forEach(item => {
        item.totalCosts = item.cogs + item.adSpend + item.shipping + item.fees + item.handling;
        item.netProfit = item.revenue - item.totalCosts;
        item.margin = item.revenue > 0 ? parseFloat(((item.netProfit / item.revenue) * 100).toFixed(2)) : 0;
        item.adSpendPerOrder = item.orders > 0 ? parseFloat((item.adSpend / item.orders).toFixed(2)) : 0;
    });

    const totalCosts = totalCOGS + totalAdSpend + totalShipping + totalFees + totalHandling;
    const netProfit = totalRevenue - totalCosts;
    const profitMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(2) : 0;
    const blendedROAS = totalAdSpend > 0 ? (totalRevenue / totalAdSpend).toFixed(2) : 0;
    const poas = totalAdSpend > 0 ? (netProfit / totalAdSpend).toFixed(2) : 0;

    // 6. ORDER SUMMARY METRICS
    const orderMetrics = {
        avgOrderValue: totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0,
        adSpendPerOrder: totalOrders > 0 ? (totalAdSpend / totalOrders).toFixed(2) : 0,
        avgOrderProfit: totalOrders > 0 ? (netProfit / totalOrders).toFixed(2) : 0,
        avgOrderCost: totalOrders > 0 ? (totalCosts / totalOrders).toFixed(2) : 0,
        purchaseFrequency: 1 
    };

    // 7. CUSTOMER SUMMARY METRICS (New)
    // For MVP, we use Total Orders as a proxy for Total Customers
    const customerSummary = {
        totalCustomers: totalOrders, 
        newCustomers: totalOrders,   
        repurchaseRate: 0,
        // CAC = Total Ad Spend / Total New Customers
        cac: totalOrders > 0 ? (totalAdSpend / totalOrders).toFixed(2) : 0 
    };

    // 8. OTHERS (Financials - New)
    const others = {
        shippingCharged: totalShipping,
        taxesCollected: 0, // Placeholder: Would come from Transaction.totalTax
        tips: 0,           // Placeholder
        giftCardSales: 0,  // Placeholder
        returns: 0         // Placeholder: Would come from 'financialStatus: refunded'
    };

    const channelData = adSpendByChannel.map(item => ({
        name: item._id, 
        value: item.value,
        color: item._id === 'META' ? '#3b82f6' : (item._id === 'TIKTOK' ? '#ec4899' : '#eab308')
    }));

    const costBreakdown = [
        { name: "COGS", value: totalCOGS, color: "#3b82f6" },
        { name: "Ad Spend", value: totalAdSpend, color: "#f97316" },
        { name: "Shipping", value: totalShipping, color: "#64748b" },
        { name: "Transaction Fees", value: totalFees, color: "#eab308" },
        { name: "Handling", value: totalHandling, color: "#10b981" }
    ].filter(item => item.value > 0);

    return res.status(200).json(
        new ApiResponse(200, {
            cards: { totalRevenue, totalAdSpend, netProfit, profitMargin, totalOrders },
            costBreakdown,
            channelData,
            adMetrics: { blendedROAS, poas, totalAdSpend },
            orderMetrics,
            customerSummary, // Added
            others,          // Added
            totalCosts,
            graphData
        }, "Stats fetched")
    );
});

export { getDashboardStats };