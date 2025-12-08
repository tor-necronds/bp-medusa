import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { DetailWidgetProps, AdminProduct } from "@medusajs/framework/types"
import { Container, Heading, Text, Textarea, Button } from "@medusajs/ui"
import { useState, useEffect } from "react"
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import { sdk } from "../lib/sdk"
import { toast } from "@medusajs/ui"

const ProductNotesWidget = ({ 
  data: product,
}: DetailWidgetProps<AdminProduct>) => {
  const queryClient = useQueryClient()
  
  // Load product with metadata to get existing notes
  const { data: queryResult } = useQuery({
    queryFn: () => sdk.admin.product.retrieve(product.id, {
      fields: "+metadata.*",
    }),
    queryKey: [["product", product.id, "notes"]],
  })

  const existingNotes = (queryResult?.product?.metadata?.internal_notes as string) || 
                        (product.metadata?.internal_notes as string) || 
                        ""

  const [notes, setNotes] = useState(existingNotes)

  // Update notes when product data is loaded
  useEffect(() => {
    if (queryResult?.product?.metadata?.internal_notes) {
      setNotes(queryResult.product.metadata.internal_notes as string)
    } else if (product.metadata?.internal_notes) {
      setNotes(product.metadata.internal_notes as string)
    }
  }, [queryResult?.product?.metadata?.internal_notes, product.metadata?.internal_notes])

  const mutation = useMutation({
    mutationFn: async (notesData: string) => {
      // Note: This uses metadata to store notes
      return sdk.admin.product.update(product.id, {
        metadata: {
          ...product.metadata,
          internal_notes: notesData,
        },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [["product", product.id]] })
      queryClient.invalidateQueries({ queryKey: [["product", product.id, "notes"]] })
      toast.success("Notes saved successfully")
    },
    onError: (error) => {
      toast.error("Failed to save notes")
      console.error("Error saving notes:", error)
    },
  })

  const handleSave = () => {
    mutation.mutate(notes)
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Internal Notes</Heading>
      </div>
      <div className="px-6 py-4 space-y-4">
        <Text size="small" className="text-ui-fg-subtle">
          Add internal notes about this product. These notes are only visible to admin users.
        </Text>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Enter your notes here..."
          rows={4}
        />
        <div className="flex justify-end">
          <Button 
            variant="primary" 
            onClick={handleSave}
            disabled={mutation.isPending}
            isLoading={mutation.isPending}
          >
            {mutation.isPending ? "Saving..." : "Save Notes"}
          </Button>
        </div>
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.after",
})

export default ProductNotesWidget

