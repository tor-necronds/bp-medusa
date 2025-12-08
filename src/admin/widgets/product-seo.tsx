import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { DetailWidgetProps, AdminProduct } from "@medusajs/framework/types";
import {
  Container,
  Heading,
  Text,
  Input,
  Textarea,
  Button,
} from "@medusajs/ui";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sdk } from "../lib/sdk";
import { toast } from "@medusajs/ui";

const ProductSEOWidget = ({
  data: product,
}: DetailWidgetProps<AdminProduct>) => {
  const queryClient = useQueryClient();
  const [metaTitle, setMetaTitle] = useState(
    (product.metadata?.seo_title as string) || product.title || ""
  );
  const [metaDescription, setMetaDescription] = useState(
    (product.metadata?.seo_description as string) || ""
  );
  const [slug, setSlug] = useState(product.handle || "");

  // Update state when product data changes
  useEffect(() => {
    setMetaTitle(
      (product.metadata?.seo_title as string) || product.title || ""
    );
    setMetaDescription((product.metadata?.seo_description as string) || "");
    setSlug(product.handle || "");
  }, [
    product.metadata?.seo_title,
    product.metadata?.seo_description,
    product.handle,
    product.title,
  ]);

  const mutation = useMutation({
    mutationFn: async (seoData: {
      handle?: string;
      metadata?: Record<string, any>;
    }) => {
      return sdk.admin.product.update(product.id, {
        handle: seoData.handle,
        metadata: {
          ...product.metadata,
          seo_title: seoData.metadata?.seo_title,
          seo_description: seoData.metadata?.seo_description,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [["product", product.id]] });
      toast.success("SEO settings saved successfully");
    },
    onError: (error) => {
      toast.error("Failed to save SEO settings");
      console.error("Error saving SEO:", error);
    },
  });

  const handleSave = () => {
    mutation.mutate({
      handle: slug,
      metadata: {
        seo_title: metaTitle,
        seo_description: metaDescription,
      },
    });
  };

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">SEO Settings</Heading>
      </div>
      <div className="px-6 py-4 space-y-4">
        <div>
          <Text size="small" weight="plus" className="mb-2 block">
            Meta Title
          </Text>
          <Input
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            placeholder="Enter meta title"
          />
          <Text size="xsmall" className="text-ui-fg-subtle mt-1">
            {metaTitle.length}/60 characters
          </Text>
        </div>
        <div>
          <Text size="small" weight="plus" className="mb-2 block">
            Meta Description
          </Text>
          <Textarea
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            placeholder="Enter meta description"
            rows={3}
          />
          <Text size="xsmall" className="text-ui-fg-subtle mt-1">
            {metaDescription.length}/160 characters
          </Text>
        </div>
        <div>
          <Text size="small" weight="plus" className="mb-2 block">
            URL Slug
          </Text>
          <Input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="product-url-slug"
          />
        </div>
        <div className="flex justify-end pt-2">
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={mutation.isPending}
            isLoading={mutation.isPending}
          >
            {mutation.isPending ? "Saving..." : "Save SEO Settings"}
          </Button>
        </div>
      </div>
    </Container>
  );
};

export const config = defineWidgetConfig({
  zone: "product.details.after",
});

export default ProductSEOWidget;
