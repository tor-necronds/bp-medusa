import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { DetailWidgetProps, AdminProduct } from "@medusajs/framework/types";
import { clx, Container, Heading, Text, Button } from "@medusajs/ui";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sdk } from "../lib/sdk";
import { toast } from "@medusajs/ui";
import { useState, useEffect } from "react";

type AdminProductBrand = AdminProduct & {
  brand?: {
    id: string;
    name: string;
  };
};

type Brand = {
  id: string;
  name: string;
};

const ProductBrandWidget = ({
  data: product,
}: DetailWidgetProps<AdminProduct>) => {
  const queryClient = useQueryClient();

  // Fetch product with brand link
  const { data: queryResult } = useQuery({
    queryFn: () =>
      sdk.admin.product.retrieve(product.id, {
        fields: "+brand.*",
      }),
    queryKey: [["product", product.id]],
  });

  // Fetch all brands
  const { data: brandsData, isLoading: isLoadingBrands } = useQuery({
    queryFn: async () => {
      const response = await sdk.client.fetch<{ brands: Brand[] }>(
        "/admin/brands",
        {
          method: "GET",
        }
      );
      return response;
    },
    queryKey: [["brands"]],
  });

  const currentBrand = (queryResult?.product as AdminProductBrand)?.brand;
  const [selectedBrandId, setSelectedBrandId] = useState<string>(
    currentBrand?.id || ""
  );
  const [savedBrandId, setSavedBrandId] = useState<string>(
    currentBrand?.id || ""
  );

  // Update selected brand and saved brand when product data loads
  useEffect(() => {
    const brandId = currentBrand?.id || "";
    setSelectedBrandId(brandId);
    setSavedBrandId(brandId);
  }, [currentBrand?.id]);

  // Mutation to link/unlink brand from product
  const mutation = useMutation({
    mutationFn: async ({
      brandId,
      existingBrandId,
    }: {
      brandId: string;
      existingBrandId?: string;
    }) => {
      try {
        // If there's an existing brand and we're changing to a different brand (or removing)
        if (existingBrandId && existingBrandId !== brandId) {
          console.log("Dismissing existing brand:", existingBrandId);
          try {
            const dismissResponse = await sdk.client.fetch(
              `/admin/products/${product.id}/dismiss/brand`,
              {
                method: "POST",
                body: {
                  brand_id: existingBrandId,
                },
              }
            );
            console.log("Dismiss response:", dismissResponse);
            // Wait a bit to ensure dismiss is fully processed
            await new Promise((resolve) => setTimeout(resolve, 100));
          } catch (dismissError) {
            console.error("Error dismissing brand:", dismissError);
            // Continue even if dismiss fails, as the link might not exist
          }
        }

        // If brandId is provided (setting a new brand), create the link
        if (brandId) {
          console.log("Creating new brand link:", brandId);
          const createResponse = await sdk.client.fetch(
            `/admin/products/${product.id}/brand`,
            {
              method: "POST",
              body: {
                brand_id: brandId,
              },
            }
          );
          console.log("Create response:", createResponse);
          return createResponse;
        }
      } catch (error: any) {
        console.error("Error in mutationFn:", error);
        // Log more details about the error
        if (error?.response) {
          console.error("Error response:", await error.response?.json?.());
        }
        throw error;
      }
    },
    onSuccess: (_, { brandId }) => {
      const savedId = brandId || "";
      setSavedBrandId(savedId);
      queryClient.invalidateQueries({ queryKey: [["product", product.id]] });
      queryClient.invalidateQueries({ queryKey: [["brands"]] });
      toast.success(
        brandId ? "Brand linked successfully" : "Brand unlinked successfully"
      );
    },
    onError: (error: any) => {
      console.error("Error updating brand:", error);
      const errorMessage =
        error?.message ||
        error?.response?.data?.message ||
        "Failed to update brand";
      toast.error(errorMessage);
    },
  });

  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const brandId = e.target.value || "";
    setSelectedBrandId(brandId);
  };

  const handleSave = () => {
    const brandId = selectedBrandId || "";
    const existingBrandId = savedBrandId || undefined;
    mutation.mutate({ brandId, existingBrandId });
  };

  const hasChanges = selectedBrandId !== savedBrandId;

  const brands = brandsData?.brands || [];
  const selectedBrand = brands.find((b) => b.id === selectedBrandId);

  console.log(product)
  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading level="h2">Brand</Heading>
        </div>
      </div>
      <div className="px-6 py-4 space-y-4">
        <div>
          <Text size="small" weight="plus" className="mb-2 block">
            Select Brand
          </Text>
          <select
            value={selectedBrandId}
            onChange={handleBrandChange}
            disabled={mutation.isPending || isLoadingBrands}
          >
            <option value="">None</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>
        {selectedBrand && (
          <div
            className={clx(
              `text-ui-fg-subtle grid grid-cols-2 items-center pt-2`
            )}
          >
            <Text size="small" weight="plus" leading="compact">
              Selected Brand
            </Text>
            <Text
              size="small"
              leading="compact"
              className="whitespace-pre-line text-pretty"
            >
              {selectedBrand.name}
            </Text>
          </div>
        )}
        <div className="flex justify-end pt-2">
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={!hasChanges || mutation.isPending || isLoadingBrands}
            isLoading={mutation.isPending}
          >
            {mutation.isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </Container>
  );
};

export const config = defineWidgetConfig({
  zone: "product.details.before",
});

export default ProductBrandWidget;
