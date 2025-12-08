import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { DetailWidgetProps, AdminProduct } from "@medusajs/framework/types"
import { Container, Heading, Text, Badge } from "@medusajs/ui"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "../lib/sdk"

const ProductStatsWidget = ({ 
  data: product,
}: DetailWidgetProps<AdminProduct>) => {
  const { data: queryResult } = useQuery({
    queryFn: () => sdk.admin.product.retrieve(product.id, {
      fields: "+variants.*,+variants.inventory_items.*",
    }),
    queryKey: [["product", product.id, "stats"]],
  })

  const variants = queryResult?.product?.variants || []
  const totalInventory = variants.reduce((sum: number, variant: any) => {
    const inventory = variant.inventory_items?.[0]?.inventory?.quantity || 0
    return sum + inventory
  }, 0)

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Product Statistics</Heading>
        <Badge color="green">Active</Badge>
      </div>
      <div className="grid grid-cols-2 gap-4 px-6 py-4">
        <div>
          <Text size="small" weight="plus" leading="compact" className="text-ui-fg-subtle">
            Variants
          </Text>
          <Text size="large" weight="plus" className="mt-1">
            {variants.length}
          </Text>
        </div>
        <div>
          <Text size="small" weight="plus" leading="compact" className="text-ui-fg-subtle">
            Total Inventory
          </Text>
          <Text size="large" weight="plus" className="mt-1">
            {totalInventory}
          </Text>
        </div>
        <div>
          <Text size="small" weight="plus" leading="compact" className="text-ui-fg-subtle">
            Status
          </Text>
          <Text size="large" weight="plus" className="mt-1">
            {product.status || "Draft"}
          </Text>
        </div>
        <div>
          <Text size="small" weight="plus" leading="compact" className="text-ui-fg-subtle">
            Created
          </Text>
          <Text size="small" className="mt-1">
            {product.created_at ? new Date(product.created_at).toLocaleDateString() : "-"}
          </Text>
        </div>
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.after",
})

export default ProductStatsWidget

