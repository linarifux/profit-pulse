import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Transaction } from "../models/transaction.model.js";
import { Store } from "../models/store.model.js";

const getTransactions = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, search = "" } = req.query;
    
    const store = await Store.findOne({ owner: req.user._id });
    if (!store) throw new ApiError(404, "Store not found");

    const matchStage = {
        store: store._id,
        // Simple search by Order Name (e.g., "#1024")
        orderName: { $regex: search, $options: "i" } 
    };

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        sort: { processedAt: -1 } // Newest first
    };

    // Use Mongoose Aggregate Paginate if installed, or standard find/skip
    // Since we didn't install 'mongoose-aggregate-paginate-v2' on this model specifically, 
    // we'll use standard count & skip logic which is lighter.
    
    const totalDocs = await Transaction.countDocuments(matchStage);
    
    const transactions = await Transaction.find(matchStage)
        .sort({ processedAt: -1 })
        .skip((options.page - 1) * options.limit)
        .limit(options.limit);

    const result = {
        docs: transactions,
        totalDocs,
        limit: options.limit,
        page: options.page,
        totalPages: Math.ceil(totalDocs / options.limit),
        hasNextPage: options.page < Math.ceil(totalDocs / options.limit),
        hasPrevPage: options.page > 1
    };

    return res.status(200).json(
        new ApiResponse(200, result, "Transactions fetched successfully")
    );
});

export { getTransactions };