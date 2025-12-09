"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const utils_1 = require("@medusajs/framework/utils");
async function GET(req, res) {
    try {
        const orderModuleService = req.scope.resolve(utils_1.Modules.ORDER);
        const customerModuleService = req.scope.resolve(utils_1.Modules.CUSTOMER);
        // Get total orders count
        // In Medusa v2, use listOrders method
        // Request summary relation to get order totals
        const orders = await orderModuleService.listOrders({}, {
            relations: ["summary"],
        });
        const orderCount = orders.length;
        // Calculate total revenue from completed orders only
        const totalRevenue = orders.reduce((sum, order) => {
            // Only count completed orders for revenue
            if (order.status === "completed") {
                // Use the correct field names from OrderDTO
                // BigNumberValue can be a string or number, so we need to convert it
                const orderTotal = order.summary?.current_order_total ||
                    order.summary?.original_order_total ||
                    order.summary?.paid_total ||
                    order.original_total ||
                    order.item_total ||
                    0;
                // Convert BigNumberValue (which might be a string) to number
                const totalValue = typeof orderTotal === "string"
                    ? parseFloat(orderTotal)
                    : Number(orderTotal) || 0;
                return sum + totalValue;
            }
            return sum;
        }, 0);
        // Get total customers count
        const customers = await customerModuleService.listCustomers({});
        const customerCount = customers.length;
        // Get recent orders (last 10) for activity feed
        const recentOrders = orders
            .sort((a, b) => {
            const dateA = new Date(a.created_at || 0).getTime();
            const dateB = new Date(b.created_at || 0).getTime();
            return dateB - dateA;
        })
            .slice(0, 10)
            .map((order) => {
            // Use the correct field names from OrderDTO
            // BigNumberValue can be a string or number, so we need to convert it
            const orderTotal = order.summary?.current_order_total ||
                order.summary?.original_order_total ||
                order.summary?.paid_total ||
                order.original_total ||
                order.item_total ||
                0;
            // Convert BigNumberValue (which might be a string) to number
            const totalValue = typeof orderTotal === "string"
                ? parseFloat(orderTotal)
                : Number(orderTotal) || 0;
            // Currency code is directly on the order object
            const currencyCode = order.currency_code || "usd";
            return {
                id: order.id,
                display_id: order.display_id || order.id?.slice(0, 8),
                email: order.email || "N/A",
                total: totalValue,
                status: order.status || "pending",
                created_at: order.created_at,
                currency_code: currencyCode,
            };
        });
        res.json({
            totalOrders: orderCount,
            totalRevenue,
            totalCustomers: customerCount,
            recentActivity: recentOrders,
        });
    }
    catch (error) {
        console.error("Error fetching reports stats:", error);
        res.status(500).json({
            error: "Failed to fetch reports data",
            message: error.message,
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2FkbWluL3JlcG9ydHMvc3RhdHMvcm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFHQSxrQkErRkM7QUFqR0QscURBQW9EO0FBRTdDLEtBQUssVUFBVSxHQUFHLENBQUMsR0FBa0IsRUFBRSxHQUFtQjtJQUMvRCxJQUFJLENBQUM7UUFDSCxNQUFNLGtCQUFrQixHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLGVBQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM1RCxNQUFNLHFCQUFxQixHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLGVBQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUVsRSx5QkFBeUI7UUFDekIsc0NBQXNDO1FBQ3RDLCtDQUErQztRQUMvQyxNQUFNLE1BQU0sR0FBRyxNQUFNLGtCQUFrQixDQUFDLFVBQVUsQ0FDaEQsRUFBRSxFQUNGO1lBQ0UsU0FBUyxFQUFFLENBQUMsU0FBUyxDQUFDO1NBQ3ZCLENBQ0YsQ0FBQztRQUNGLE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFFakMscURBQXFEO1FBQ3JELE1BQU0sWUFBWSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFXLEVBQUUsS0FBVSxFQUFFLEVBQUU7WUFDN0QsMENBQTBDO1lBQzFDLElBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxXQUFXLEVBQUUsQ0FBQztnQkFDakMsNENBQTRDO2dCQUM1QyxxRUFBcUU7Z0JBQ3JFLE1BQU0sVUFBVSxHQUNkLEtBQUssQ0FBQyxPQUFPLEVBQUUsbUJBQW1CO29CQUNsQyxLQUFLLENBQUMsT0FBTyxFQUFFLG9CQUFvQjtvQkFDbkMsS0FBSyxDQUFDLE9BQU8sRUFBRSxVQUFVO29CQUN6QixLQUFLLENBQUMsY0FBYztvQkFDcEIsS0FBSyxDQUFDLFVBQVU7b0JB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