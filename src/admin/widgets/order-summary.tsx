import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { DetailWidgetProps, AdminOrder } from "@medusajs/framework/types"
import { Container, Heading, Text, Badge } from "@medusajs/ui"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "../lib/sdk"

const OrderSummaryWidget = ({ 
  data: order,
}: DetailWidgetProps<AdminOrder>) => {
  const { data: queryResult } = useQuery({
    queryFn: () => sdk.admin.order.retrieve(order.id, {
      fields: "+items.*,+items.variant.*",
    }),
    queryKey: [["order", order.id, "summary"]],
  })

  const items = queryResult?.order?.items || []
  const totalItems = items.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0)

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "orange"
      case "completed":
        return "green"
      case "canceled":
        return "red"
      default:
        return "grey"
    }
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Order Summary</Heading>
        <Badge color={getStatusColor(order.status)}>
          {order.status || "Unknown"}
        </Badge>
      </div>
      <div className="grid grid-cols-2 gap-4 px-6 py-4">
        <div>
          <Text size="small" weight="plus" leading="compact" className="text-ui-fg-subtle">
            Total Items
          </Text>
          <Text size="large" weight="plus" className="mt-1">
            {totalItems}
          </Text>
        </div>
        <div>
          <Text size="small" weight="plus" leading="compact" className="text-ui-fg-subtle">
            Order Total
          </Text>
          <Text size="large" weight="plus" className="mt-1">
            {order.total ? `${order.total / 100} ${order.currency_code?.toUpperCase()}` : "-"}
          </Text>
        </div>
        <div>
          <Text size="small" weight="plus" leading="compact" className="text-ui-fg-subtle">
            Customer Email
          </Text>
          <Text size="small" className="mt-1">
            {order.email || "-"}
          </Text>
        </div>
        <div>
          <Text size="small" weight="plus" leading="compact" className="text-ui-fg-subtle">
            Created Date
          </Text>
          <Text size="small" className="mt-1">
            {order.created_at ? new Date(order.created_at).toLocaleDateString() : "-"}
          </Text>
        </div>
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "order.details.before",
})

export default OrderSummaryWidget

