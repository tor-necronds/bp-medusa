import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text } from "@medusajs/ui"

const ProductListWelcomeWidget = () => {
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <Container className="p-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
      <div className="px-6 py-6">
        <Heading level="h2" className="mb-2">
          Product Management 👋
        </Heading>
        <Text className="text-ui-fg-subtle">
          Today is {currentDate} - Manage your products from here.
        </Text>
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product.list.before",
})

export default ProductListWelcomeWidget

