import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { Modules } from "@medusajs/framework/utils";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const orderModuleService = req.scope.resolve(Modules.ORDER);
    const customerModuleService = req.scope.resolve(Modules.CUSTOMER);

    // Get total orders count
    // In Medusa v2, use listOrders method
    // Request summary relation to get order totals
    const orders = await orderModuleService.listOrders(
      {},
      {
        relations: ["summary"],
      }
    );
    const orderCount = orders.length;

    // Calculate total revenue from completed orders only
    const totalRevenue = orders.reduce((sum: number, order: any) => {
      // Only count completed orders for revenue
      if (order.status === "completed") {
        // Use the correct field names from OrderDTO
        // BigNumberValue can be a string or number, so we need to convert it
        const orderTotal =
          order.summary?.current_order_total ||
          order.summary?.original_order_total ||
          order.summary?.paid_total ||
          order.original_total ||
          order.item_total ||
          0;
        // Convert BigNumberValue (which might be a string) to number
        const totalValue =
          typeof orderTotal === "string"
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
      .sort((a: any, b: any) => {
        const dateA = new Date(a.created_at || 0).getTime();
        const dateB = new Date(b.created_at || 0).getTime();
        return dateB - dateA;
      })
      .slice(0, 10)
      .map((order: any) => {
        // Use the correct field names from OrderDTO
        // BigNumberValue can be a string or number, so we need to convert it
        const orderTotal =
          order.summary?.current_order_total ||
          order.summary?.original_order_total ||
          order.summary?.paid_total ||
          order.original_total ||
          order.item_total ||
          0;

        // Convert BigNumberValue (which might be a string) to number
        const totalValue =
          typeof orderTotal === "string"
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
  } catch (error: any) {
    console.error("Error fetching reports stats:", error);
    res.status(500).json({
      error: "Failed to fetch reports data",
      message: error.message,
    });
  }
}
