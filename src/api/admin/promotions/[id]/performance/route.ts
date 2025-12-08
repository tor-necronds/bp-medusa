import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { Modules } from "@medusajs/framework/utils";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const { id } = req.params;
    const promotionModuleService = req.scope.resolve(Modules.PROMOTION);
    const orderModuleService = req.scope.resolve(Modules.ORDER);

    // Get the promotion
    const promotion = await promotionModuleService.retrievePromotion(id);

    // Get the promotion's usage count (this is the authoritative source)
    const promotionUsageCount = promotion.used || 0;

    // Get all orders with adjustments relation to find orders that used this promotion
    const orders = await orderModuleService.listOrders(
      {},
      {
        relations: ["summary", "adjustments"],
      }
    );

    // Filter orders that used this promotion
    // Check multiple possible ways promotions are linked to orders:
    // 1. Through adjustments with promotion_id
    // 2. Through code matching (if promotion code is stored)
    const ordersWithPromotion = orders.filter((order: any) => {
      // Check if order has adjustments with this promotion ID
      const hasPromotionAdjustment =
        order.adjustments?.some(
          (adj: any) => adj.promotion_id === id || adj.code === promotion.code
        ) || false;

      // Also check if order has a promotions array (if exists)
      const hasPromotionInList =
        order.promotions?.some((promo: any) => promo.id === id) || false;

      return hasPromotionAdjustment || hasPromotionInList;
    });

    // Use promotion's used count if we can't find orders, but defer to actual order count if found
    // This handles cases where orders might not be queryable but promotion tracks usage
    const totalUsage =
      ordersWithPromotion.length > 0
        ? ordersWithPromotion.length
        : promotionUsageCount;

    // Log for debugging if there's a mismatch
    if (promotionUsageCount > 0 && ordersWithPromotion.length === 0) {
      console.log(
        `Promotion ${id} shows ${promotionUsageCount} uses but no orders found. Using promotion's usage count.`
      );
    }

    const totalDiscount = ordersWithPromotion.reduce(
      (sum: number, order: any) => {
        // Check multiple ways to find the discount amount
        const discount =
          order.adjustments?.find(
            (adj: any) =>
              adj.promotion_id === id ||
              adj.code === promotion.code ||
              adj.promotion_code === promotion.code
          )?.amount || 0;
        return sum + (Number(discount) || 0);
      },
      0
    );

    const totalOrderValue = ordersWithPromotion.reduce(
      (sum: number, order: any) => {
        const orderTotal =
          order.summary?.current_order_total ||
          order.summary?.original_order_total ||
          order.summary?.paid_total ||
          order.original_total ||
          order.item_total ||
          0;
        const totalValue =
          typeof orderTotal === "string"
            ? parseFloat(orderTotal)
            : Number(orderTotal) || 0;
        return sum + totalValue;
      },
      0
    );

    // Calculate average order value
    // If no orders found but promotion has usage, we can't calculate accurate metrics
    const averageOrderValue =
      ordersWithPromotion.length > 0 && totalOrderValue > 0
        ? totalOrderValue / ordersWithPromotion.length
        : 0;

    // Get currency code from first order
    // Promotions don't have currency_code directly - it's determined by the order
    // If no orders found, default to USD
    const currencyCode =
      ordersWithPromotion.length > 0
        ? ordersWithPromotion[0]?.currency_code || "usd"
        : "usd";

    // Calculate monthly usage
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const usageThisMonth = ordersWithPromotion.filter((order: any) => {
      const orderDate = new Date(order.created_at);
      return orderDate >= thisMonth;
    }).length;

    const usageLastMonth = ordersWithPromotion.filter((order: any) => {
      const orderDate = new Date(order.created_at);
      return orderDate >= lastMonth && orderDate <= lastMonthEnd;
    }).length;

    // Get recent usage (last 10 orders)
    const recentUsage = ordersWithPromotion
      .sort((a: any, b: any) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return dateB - dateA;
      })
      .slice(0, 10)
      .map((order: any) => {
        // Check multiple ways to find the discount amount
        const discount =
          order.adjustments?.find(
            (adj: any) =>
              adj.promotion_id === id ||
              adj.code === promotion.code ||
              adj.promotion_code === promotion.code
          )?.amount || 0;

        const orderTotal =
          order.summary?.current_order_total ||
          order.original_total ||
          order.item_total ||
          0;
        const totalValue =
          typeof orderTotal === "string"
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
  } catch (error: any) {
    console.error("Error fetching promotion performance:", error);
    res.status(500).json({
      error: "Failed to fetch promotion performance",
      message: error.message,
    });
  }
}
