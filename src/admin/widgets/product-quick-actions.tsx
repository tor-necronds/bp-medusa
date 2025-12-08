import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { DetailWidgetProps, AdminProduct } from "@medusajs/framework/types";
import { Container, Heading, Button } from "@medusajs/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sdk } from "../lib/sdk";
import { toast } from "@medusajs/ui";

const ProductQuickActionsWidget = ({
  data: product,
}: DetailWidgetProps<AdminProduct>) => {
  const queryClient = useQueryClient();

  const duplicateMutation = useMutation({
    mutationFn: async () => {
      // Note: Product duplication requires more fields (options, variants, etc.)
      // This is a simplified example. For full duplication, you may need a custom API endpoint
      toast.info(
        "Product duplication feature requires additional setup. Please use the built-in duplicate feature."
      );
      throw new Error(
        "Full duplication not implemented - use built-in feature"
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [["product"]] });
      toast.success("Product duplicated successfully");
    },
    onError: (error) => {
      toast.error("Failed to duplicate product");
      console.error("Error duplicating product:", error);
    },
  });

  const archiveMutation = useMutation({
    mutationFn: async () => {
      return sdk.admin.product.update(product.id, {
        status: "archived" as any, // Update status to archived
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [["product", product.id]] });
      toast.success("Product archived successfully");
    },
    onError: (error) => {
      toast.error("Failed to archive product");
      console.error("Error archiving product:", error);
    },
  });

  const testBrandApiMutation = useMutation({
    mutationFn: async () => {
      // สร้างชื่อ brand
      const now = new Date()
      const dateStr = now.toISOString().split("T")[0]
      const brandName = `Acme`
  
      console.log("Request Body:", { name: brandName })
  
      // ใช้ JS SDK ยิงไปที่ custom admin route
      const data = await sdk.client.fetch<{ brand: any }>(
        "/admin/brands",
        {
          method: "POST",
          body: {
            name: brandName,
          },
        }
      )
  
      console.log("Parsed JSON:", data) // ควรได้ { brand: {...} }
  
      return data
    },
    onSuccess: (data) => {
      toast.success("Brand API test successful")
      console.log("Success - Brand API Response:", data)
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error"
      toast.error(`Failed to test Brand API: ${errorMessage}`)
      console.error("Error testing Brand API:", error)
    },
  })

  const handleDuplicate = () => {
    if (confirm("Are you sure you want to duplicate this product?")) {
      duplicateMutation.mutate();
    }
  };

  const handleExport = () => {
    // Export as JSON
    const dataStr = JSON.stringify(product, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `product-${product.handle || product.id}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Product data exported");
  };

  const handleArchive = () => {
    if (confirm("Are you sure you want to archive this product?")) {
      archiveMutation.mutate();
    }
  };

  const handleTestBrandApi = () => {
    testBrandApiMutation.mutate();
  };

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Quick Actions</Heading>
      </div>
      <div className="flex flex-col gap-2 px-6 py-4">
        <Button
          variant="secondary"
          onClick={handleDuplicate}
          disabled={duplicateMutation.isPending}
          isLoading={duplicateMutation.isPending}
        >
          Duplicate Product
        </Button>
        <Button variant="secondary" onClick={handleExport}>
          Export Product Data
        </Button>
        <Button
          variant="secondary"
          onClick={handleArchive}
          disabled={archiveMutation.isPending}
          isLoading={archiveMutation.isPending}
        >
          Archive Product
        </Button>
        <Button
          variant="secondary"
          onClick={handleTestBrandApi}
          disabled={testBrandApiMutation.isPending}
          isLoading={testBrandApiMutation.isPending}
        >
          Test Brand API
        </Button>
      </div>
    </Container>
  );
};

export const config = defineWidgetConfig({
  zone: "product.details.after",
});

export default ProductQuickActionsWidget;
