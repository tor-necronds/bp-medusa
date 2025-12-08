import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { DetailWidgetProps, AdminProduct } from "@medusajs/framework/types"
import { Container, Heading, Badge, Button, Input } from "@medusajs/ui"
import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../lib/sdk"
import { toast } from "@medusajs/ui"

const ProductTagsWidget = ({ 
  data: product,
}: DetailWidgetProps<AdminProduct>) => {
  const queryClient = useQueryClient()
  const [tags, setTags] = useState<string[]>(
    (product.metadata?.tags as string[]) || []
  )
  const [newTag, setNewTag] = useState("")

  const mutation = useMutation({
    mutationFn: async (tagsData: string[]) => {
      return sdk.admin.product.update(product.id, {
        metadata: {
          ...product.metadata,
          tags: tagsData,
        },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [["product", product.id]] })
      toast.success("Tags updated successfully")
    },
    onError: (error) => {
      toast.error("Failed to update tags")
      console.error("Error updating tags:", error)
    },
  })

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const updatedTags = [...tags, newTag.trim()]
      setTags(updatedTags)
      mutation.mutate(updatedTags)
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove)
    setTags(updatedTags)
    mutation.mutate(updatedTags)
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Product Tags</Heading>
      </div>
      <div className="px-6 py-4 space-y-3">
        <div className="flex gap-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                handleAddTag()
              }
            }}
            placeholder="Enter tag name"
            className="flex-1"
          />
          <Button 
            variant="secondary" 
            size="small" 
            onClick={handleAddTag}
            disabled={mutation.isPending || !newTag.trim()}
          >
            Add
          </Button>
        </div>
        {tags.length === 0 ? (
          <p className="text-ui-fg-subtle text-sm">No tags added yet</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge
                key={tag}
                color="blue"
                className="cursor-pointer"
                onClick={() => handleRemoveTag(tag)}
              >
                {tag} ×
              </Badge>
            ))}
          </div>
        )}
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.after",
})

export default ProductTagsWidget

