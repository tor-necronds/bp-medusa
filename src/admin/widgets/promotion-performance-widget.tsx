import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { Container, Heading, Text, Badge, Button } from "@medusajs/ui";
import { DetailWidgetProps } from "@medusajs/framework/types";
import { useState, useEffect } from "react";
import { ArrowRight } from "@medusajs/icons";

interface RecentUsage {
  orderId: string;
  orderDisplayId: string;
  customerEmail: string;
  discountAmount: number;
  orderTotal: number;
  usedAt: string;
}

interface PromotionPerformance {
  totalUsage: number;
  totalDiscount: number;
  ordersCount: number;
  averageOrderValue: number;
  currencyCode: string;
  recentUsage: RecentUsage[];
  usageThisMonth: number;
  usageLastMonth: number;
}

// The widget
const PromotionPerformanceWidget = ({ data }: DetailWidgetProps<any>) => {
  const [performance, setPerformance] = useState<PromotionPerformance | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch promotion performance data
    const fetchPerformance = async () => {
      try {
        const response = await fetch(
          `/admin/promotions/${data.id}/performance`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch performance data");
        }
        const performanceData = await response.json();
        setPerformance(performanceData);
      } catch (error) {
        console.error("Error fetching promotion performance:", error);
        // Set default values on error
        setPerformance({
          totalUsage: 0,
          totalDiscount: 0,
          ordersCount: 0,
          averageOrderValue: 0,
          currencyCode: "usd",
          recentUsage: [],
          usageThisMonth: 0,
          usageLastMonth: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    if (data?.id) {
      fetchPerformance();
    }
  }, [data?.id]);

  const formatCurrency = (
    amount: number | null | undefined,
    currencyCode: string = "usd"
  ) => {
    if (amount == null || isNaN(Number(amount))) {
      return "N/A";
    }
    const numAmount = Number(amount);
    // Check if amount is already in decimal format (less than 10000) or in cents (needs division)
    const formattedAmount = numAmount > 10000 ? numAmount / 100 : numAmount;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: (currencyCode || "usd").toUpperCase(),
    }).format(formattedAmount);
  };

  if (loading) {
    return (
      <Container className="divide-y p-0">
        <div className="px-6 py-4">
          <Text className="text-ui-fg-subtle">Loading performance data...</Text>
        </div>
      </Container>
    );
  }

  return (
    <Container className="divide-y p-0">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <Heading level="h2">Promotion Performance</Heading>
          <Badge
            className={
              data?.is_active
                ? "bg-ui-tag-green-bg text-ui-tag-green-text"
                : "bg-ui-tag-grey-bg text-ui-tag-grey-text"
            }
          >
            {data?.is_active ? "Active" : "Inactive"}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="rounded-lg border border-ui-border-base bg-ui-bg-base p-4">
            <Text className="text-ui-fg-subtle text-sm font-medium">
              Total Usage
            </Text>
            <Text className="text-2xl font-semibold mt-1">
              {performance?.totalUsage || 0}
            </Text>
            <Text className="text-ui-fg-subtle text-xs mt-1">times used</Text>
            {performance && performance.usageThisMonth > 0 && (
              <Text className="text-ui-fg-subtle text-xs mt-2">
                {performance.usageThisMonth} this month
              </Text>
            )}
          </div>

          <div className="rounded-lg border border-ui-border-base bg-ui-bg-base p-4">
            <Text className="text-ui-fg-subtle text-sm font-medium">
              Total Discount
            </Text>
            <Text className="text-2xl font-semibold mt-1">
              {performance?.totalDiscount
                ? formatCurrency(
                    performance.totalDiscount,
                    performance.currencyCode
                  )
                : "$0.00"}
            </Text>
            <Text className="text-ui-fg-subtle text-xs mt-1">
              discount given
            </Text>
          </div>

          <div className="rounded-lg border border-ui-border-base bg-ui-bg-base p-4">
            <Text className="text-ui-fg-subtle text-sm font-medium">
              Orders
            </Text>
            <Text className="text-2xl font-semibold mt-1">
              {performance?.ordersCount || 0}
            </Text>
            <Text className="text-ui-fg-subtle text-xs mt-1">
              orders with this promotion
            </Text>
          </div>

          <div className="rounded-lg border border-ui-border-base bg-ui-bg-base p-4">
            <Text className="text-ui-fg-subtle text-sm font-medium">
              Avg Order Value
            </Text>
            <Text className="text-2xl font-semibold mt-1">
              {performance?.averageOrderValue
                ? formatCurrency(
                    performance.averageOrderValue,
                    performance.currencyCode
                  )
                : "$0.00"}
            </Text>
            <Text className="text-ui-fg-subtle text-xs mt-1">
              average order amount
            </Text>
          </div>
        </div>

        {/* Recent Usage Section */}
        {performance &&
          performance.recentUsage &&
          performance.recentUsage.length > 0 && (
            <div className="mt-6 pt-6 border-t border-ui-border-base">
              <div className="flex items-center justify-between mb-4">
                <Heading level="h3">Recent Usage</Heading>
                <Button variant="transparent" size="small">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-3">
                {performance.recentUsage.slice(0, 5).map((usage, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg border border-ui-border-base bg-ui-bg-subtle-hover"
                  >
                    <div className="flex-1">
                      <Text className="font-medium text-sm">
                        Order #
                        {usage.orderDisplayId || usage.orderId.slice(0, 8)}
                      </Text>
                      <Text className="text-ui-fg-subtle text-xs mt-1">
                        {usage.customerEmail || "Guest"}
                      </Text>
                      <Text className="text-ui-fg-subtle text-xs">
                        {new Date(usage.usedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Text>
                    </div>
                    <div className="text-right">
                      <Text className="font-semibold text-sm text-ui-fg-success">
                        -
                        {formatCurrency(
                          usage.discountAmount,
                          performance.currencyCode
                        )}
                      </Text>
                      <Text className="text-ui-fg-subtle text-xs">
                        Order:{" "}
                        {formatCurrency(
                          usage.orderTotal,
                          performance.currencyCode
                        )}
                      </Text>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        {data?.starts_at && (
          <div className="mt-4 pt-4 border-t border-ui-border-base">
            <div className="flex justify-between text-sm">
              <Text className="text-ui-fg-subtle">Start Date:</Text>
              <Text>
                {new Date(data.starts_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </Text>
            </div>
            {data?.ends_at && (
              <div className="flex justify-between text-sm mt-2">
                <Text className="text-ui-fg-subtle">End Date:</Text>
                <Text>
                  {new Date(data.ends_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </Text>
              </div>
            )}
          </div>
        )}
      </div>
    </Container>
  );
};

// The widget's configurations
// Available zones for promotions:
// - "promotion.details.before" - Top of promotion detail page
// - "promotion.details.after" - Bottom of promotion detail page
// For campaigns (if using campaign module):
// - "campaign.details.before" - Top of campaign detail page
// - "campaign.details.after" - Bottom of campaign detail page
export const config = defineWidgetConfig({
  zone: "promotion.details.after",
});

export default PromotionPerformanceWidget;
