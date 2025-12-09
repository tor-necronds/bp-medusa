"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const utils_1 = require("@medusajs/framework/utils");
async function GET(req, res) {
    try {
        const { id } = req.params;
        const promotionModuleService = req.scope.resolve(utils_1.Modules.PROMOTION);
        const orderModuleService = req.scope.resolve(utils_1.Modules.ORDER);
        // Get the promotion
        const promotion = await promotionModuleService.retrievePromotion(id);
        // Get the promotion's usage count (this is the authoritative source)
        const promotionUsageCount = promotion.used || 0;
        // Get all orders with adjustments relation to find orders that used this promotion
        const orders = await orderModuleService.listOrders({}, {
            relations: ["summary", "adjustments"],
        });
        // Filter orders that used this promotion
        // Check multiple possible ways promotions are linked to orders:
        // 1. Through adjustments with promotion_id
        // 2. Through code matching (if promotion code is stored)
        const ordersWithPromotion = orders.filter((order) => {
            // Check if order has adjustments with this promotion ID
            const hasPromotionAdjustment = order.adjustments?.some((adj) => adj.promotion_id === id || adj.code === promotion.code) || false;
            // Also check if order has a promotions array (if exists)
            const hasPromotionInList = order.promotions?.some((promo) => promo.id === id) || false;
            return hasPromotionAdjustment || hasPromotionInList;
        });
        // Use promotion's used count if we can't find orders, but defer to actual order count if found
        // This handles cases where orders might not be queryable but promotion tracks usage
        const totalUsage = ordersWithPromotion.length > 0
            ? ordersWithPromotion.length
            : promotionUsageCount;
        // Log for debugging if there's a mismatch
        if (promotionUsageCount > 0 && ordersWithPromotion.length === 0) {
            console.log(`Promotion ${id} shows ${promotionUsageCount} uses but no orders found. Using promotion's usage count.`);
        }
        const totalDiscount = ordersWithPromotion.reduce((sum, order) => {
            // Check multiple ways to find the discount amount
            const discount = order.adjustments?.find((adj) => adj.promotion_id === id ||
                adj.code === promotion.code ||
                adj.promotion_code === promotion.code)?.amount || 0;
            return sum + (Number(discount) || 0);
        }, 0);
        const totalOrderValue = ordersWithPromotion.reduce((sum, order) => {
            const orderTotal = order.summary?.current_order_total ||
                order.summary?.original_order_total ||
                order.summary?.paid_total ||
                order.original_total ||
                order.item_total ||
                0;
            const totalValue = typeof orderTotal === "string"
                ? parseFloat(orderTotal)
                : Number(orderTotal) || 0;
            return sum + totalValue;
        }, 0);
        // Calculate average order value
        // If no orders found but promotion has usage, we can't calculate accurate metrics
        const averageOrderValue = ordersWithPromotion.length > 0 && totalOrderValue > 0
            ? totalOrderValue / ordersWithPromotion.length
            : 0;
        // Get currency code from first order
        // Promotions don't have currency_code directly - it's determined by the order
        // If no orders found, default to USD
        const currencyCode = ordersWithPromotion.length > 0
            ? ordersWithPromotion[0]?.currency_code || "usd"
            : "usd";
        // Calculate monthly usage
        const now = new Date();
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
        const usageThisMonth = ordersWithPromotion.filter((order) => {
            const orderDate = new Date(order.created_at);
            return orderDate >= thisMonth;
        }).length;
        const usageLastMonth = ordersWithPromotion.filter((order) => {
            const orderDate = new Date(order.created_at);
            return orderDate >= lastMonth && orderDate <= lastMonthEnd;
        }).length;
        // Get recent usage (last 10 orders)
        const recentUsage = ordersWithPromotion
            .sort((a, b) => {
            const dateA = new Date(a.created_at).getTime();
            const dateB = new Date(b.created_at).getTime();
            return dateB - dateA;
        })
            .slice(0, 10)
            .map((order) => {
            // Check multiple ways to find the discount amount
            const discount = order.adjustments?.find((adj) => adj.promotion_id === id ||
                adj.code === promotion.code ||
                adj.promotion_code === promotion.code)?.amount || 0;
            const orderTotal = order.summary?.current_order_total ||
                order.original_total ||
                order.item_total ||
                0;
            const totalValue = typeof orderTotal === "string"
                ? parseFloat(orderTotal)
                : Number(orderTotal) || 0;
            return {
                orderId: order.id,
                orderDisplayId: order.display_id || order.id.slice(0, 8),
                customerEmail: order.email || "Guest",
                discountAmount: Number(discount) || 0,
                orderTotal: totalValue,
                usedAt: order.created_at,
            };
        });
        res.json({
            totalUsage,
            totalDiscount,
            ordersCount: totalUsage,
            averageOrderValue,
            currencyCode,
            recentUsage,
            usageThisMonth,
            usageLastMonth,
        });
    }
    catch (error) {
        console.error("Error fetching promotion performance:", error);
        res.status(500).json({
            error: "Failed to fetch promotion performance",
            message: error.message,
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2FkbWluL3Byb21vdGlvbnMvW2lkXS9wZXJmb3JtYW5jZS9yb3V0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUdBLGtCQTJLQztBQTdLRCxxREFBb0Q7QUFFN0MsS0FBSyxVQUFVLEdBQUcsQ0FBQyxHQUFrQixFQUFFLEdBQW1CO0lBQy9ELElBQUksQ0FBQztRQUNILE1BQU0sRUFBRSxFQUFFLEVBQUUsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDO1FBQzFCLE1BQU0sc0JBQXNCLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsZUFBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3BFLE1BQU0sa0JBQWtCLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsZUFBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRTVELG9CQUFvQjtRQUNwQixNQUFNLFNBQVMsR0FBRyxNQUFNLHNCQUFzQixDQUFDLGlCQUFpQixDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRXJFLHFFQUFxRTtRQUNyRSxNQUFNLG1CQUFtQixHQUFHLFNBQVMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDO1FBRWhELG1GQUFtRjtRQUNuRixNQUFNLE1BQU0sR0FBRyxNQUFNLGtCQUFrQixDQUFDLFVBQVUsQ0FDaEQsRUFBRSxFQUNGO1lBQ0UsU0FBUyxFQUFFLENBQUMsU0FBUyxFQUFFLGFBQWEsQ0FBQztTQUN0QyxDQUNGLENBQUM7UUFFRix5Q0FBeUM7UUFDekMsZ0VBQWdFO1FBQ2hFLDJDQUEyQztRQUMzQyx5REFBeUQ7UUFDekQsTUFBTSxtQkFBbUIsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBVSxFQUFFLEVBQUU7WUFDdkQsd0RBQXdEO1lBQ3hELE1BQU0sc0JBQXNCLEdBQzFCLEtBQUssQ0FBQyxXQUFXLEVBQUUsSUFBSSxD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