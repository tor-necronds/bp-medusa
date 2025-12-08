import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { DetailWidgetProps, AdminOrder } from "@medusajs/framework/types"
import { Container, Heading, Text } from "@medusajs/ui"

const OrderTimelineWidget = ({ 
  data: order,
}: DetailWidgetProps<AdminOrder>) => {
  const timeline = [
    {
      event: "Order Created",
      date: order.created_at,
      status: "completed",
    },
    {
      event: "Payment Received",
      date: order.created_at, // In real app, use payment date
      status: order.payment_status === "captured" ? "completed" : "pending",
    },
    {
      event: "Order Fulfilled",
      date: null,
      status: order.fulfillment_status === "fulfilled" ? "completed" : "pending",
    },
  ]

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Order Timeline</Heading>
      </div>
      <div className="px-6 py-4">
        <div className="space-y-4">
          {timeline.map((item, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className={`w-2 h-2 rounded-full mt-2 ${
                item.status === "completed" ? "bg-green-500" : "bg-gray-300"
              }`} />
              <div className="flex-1">
                <Text size="small" weight="plus">
                  {item.event}
                </Text>
                <Text size="xsmall" className="text-ui-fg-subtle">
                  {item.date 
                    ? new Date(item.date).toLocaleString()
                    : "Pending"
                  }
                </Text>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "order.details.after",
})

export default OrderTimelineWidget

