import { defineRouteConfig } from "@medusajs/admin-sdk";
import {
  Tag,
  EllipsisHorizontal,
  PencilSquare,
  Trash,
  XMark,
  Plus,
} from "@medusajs/icons";
import {
  Container,
  Heading,
  Button,
  Table,
  Text,
  Input,
  DropdownMenu,
} from "@medusajs/ui";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@medusajs/ui";
import { useState } from "react";
import { sdk } from "../../lib/sdk";

type Brand = {
  id: string;
  name: string;
  created_at?: string;
  updated_at?: string;
};

const BrandsPage = () => {
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [deletingBrand, setDeletingBrand] = useState<Brand | null>(null);
  const [brandName, setBrandName] = useState("");

  // Fetch all brands
  const { data: brandsData, isLoading } = useQuery({
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

  // Create brand mutation
  const createMutation = useMutation({
    mutationFn: async (name: string) => {
      const response = await sdk.client.fetch<{ brand: Brand }>(
        "/admin/brands",
        {
          method: "POST",
          body: {
            name,
          },
        }
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [["brands"]] });
      toast.success("Brand created successfully");
      setIsCreateModalOpen(false);
      setBrandName("");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.message ||
        error?.response?.data?.message ||
        "Failed to create brand";
      toast.error(errorMessage);
    },
  });

  // Update brand mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const response = await sdk.client.fetch<{ brand: Brand }>(
        `/admin/brands/${id}`,
        {
          method: "PUT",
          body: {
            name,
          },
        }
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [["brands"]] });
      toast.success("Brand updated successfully");
      setIsEditModalOpen(false);
      setEditingBrand(null);
      setBrandName("");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.message ||
        error?.response?.data?.message ||
        "Failed to update brand";
      toast.error(errorMessage);
    },
  });

  // Delete brand mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await sdk.client.fetch(`/admin/brands/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [["brands"]] });
      toast.success("Brand deleted successfully");
      setIsDeleteDialogOpen(false);
      setDeletingBrand(null);
    },
    onError: (error: any) => {
      const errorMessage =
        error?.message ||
        error?.response?.data?.message ||
        "Failed to delete brand";
      toast.error(errorMessage);
    },
  });

  const handleCreate = () => {
    if (!brandName.trim()) {
      toast.error("Brand name is required");
      return;
    }
    createMutation.mutate(brandName.trim());
  };

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setBrandName(brand.name);
    setIsEditModalOpen(true);
  };

  const handleUpdate = () => {
    if (!brandName.trim() || !editingBrand) {
      toast.error("Brand name is required");
      return;
    }
    updateMutation.mutate({
      id: editingBrand.id,
      name: brandName.trim(),
    });
  };

  const handleDeleteClick = (brand: Brand) => {
    setDeletingBrand(brand);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deletingBrand) {
      deleteMutation.mutate(deletingBrand.id);
    }
  };

  const brands = brandsData?.brands || [];

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Brands</Heading>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus />
          Create Brand
        </Button>
      </div>

      {isLoading ? (
        <div className="px-6 py-4">
          <Text>Loading...</Text>
        </div>
      ) : (
        <div className="py-4">
          {brands.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Text className="text-ui-fg-subtle mb-4">
                No brands found. Create your first brand to get started.
              </Text>
            </div>
          ) : (
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Name</Table.HeaderCell>
                  <Table.HeaderCell>Created At</Table.HeaderCell>
                  <Table.HeaderCell className="text-right">
                    Actions
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {brands.map((brand) => (
                  <Table.Row key={brand.id}>
                    <Table.Cell>
                      <Text weight="plus">{brand.name}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="small" className="text-ui-fg-subtle">
                        {brand.created_at
                          ? new Date(brand.created_at).toLocaleDateString()
                          : "-"}
                      </Text>
                    </Table.Cell>
                    <Table.Cell className="text-right">
                      <div className="flex items-center justify-end">
                        <DropdownMenu>
                          <DropdownMenu.Trigger asChild>
                            <Button variant="transparent" size="small">
                              <EllipsisHorizontal className="text-ui-fg-subtle" />
                            </Button>
                          </DropdownMenu.Trigger>
                          <DropdownMenu.Content
                            align="end"
                            className="min-w-[200px]"
                          >
                            <DropdownMenu.Item
                              onClick={() => handleEdit(brand)}
                            >
                              <div className="flex items-center gap-x-2">
                                <PencilSquare className="text-ui-fg-subtle" />
                                <span>Edit</span>
                              </div>
                            </DropdownMenu.Item>
                            <DropdownMenu.Separator />
                            <DropdownMenu.Item
                              onClick={() => handleDeleteClick(brand)}
                            >
                              <div className="flex items-center gap-x-2 text-ui-fg-destructive">
                                <Trash className="text-ui-fg-destructive" />
                                <span>Delete</span>
                              </div>
                            </DropdownMenu.Item>
                          </DropdownMenu.Content>
                        </DropdownMenu>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          )}
        </div>
      )}

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => {
            setIsCreateModalOpen(false);
            setBrandName("");
          }}
        >
          <Container
            className="w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="py-4 border-b">
              <Heading level="h3">Create Brand</Heading>
            </div>
            <div className="py-4 space-y-4">
              <div>
                <Text size="small" weight="plus" className="mb-2 block">
                  Brand Name
                </Text>
                <Input
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="Enter brand name"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleCreate();
                    }
                  }}
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setBrandName("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleCreate}
                  isLoading={createMutation.isPending}
                >
                  Create
                </Button>
              </div>
            </div>
          </Container>
        </div>
      )}

      {/* Edit Sheet */}
      {isEditModalOpen && editingBrand && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-black/50 transition-opacity animate-in fade-in duration-200"
            onClick={() => {
              setIsEditModalOpen(false);
              setEditingBrand(null);
              setBrandName("");
            }}
          />
          {/* Sheet */}
          <div
            className="fixed inset-y-0 right-0 z-50 w-full max-w-[560px] shadow-xl animate-in slide-in-from-right duration-300 my-2"
            onClick={(e) => e.stopPropagation()}
          >
            <Container className="h-full flex flex-col divide-y p-0">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4">
                <Heading level="h2">Edit Brand</Heading>
                <Button
                  variant="transparent"
                  size="small"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingBrand(null);
                    setBrandName("");
                  }}
                >
                  <XMark />
                </Button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <div className="space-y-6">
                  <div>
                    <Text size="small" weight="plus" className="mb-2 block">
                      Brand Name
                    </Text>
                    <Input
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      placeholder="Enter brand name"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleUpdate();
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-x-2 px-6 py-4 border-t">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingBrand(null);
                    setBrandName("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleUpdate}
                  isLoading={updateMutation.isPending}
                >
                  Save changes
                </Button>
              </div>
            </Container>
          </div>
        </>
      )}

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && deletingBrand && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => {
            setIsDeleteDialogOpen(false);
            setDeletingBrand(null);
          }}
        >
          <Container
            className="w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="py-4 border-b">
              <Heading level="h3">Delete Brand</Heading>
            </div>
            <div className="py-4 space-y-4">
              <Text className="text-ui-fg-subtle">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-ui-fg-base">
                  "{deletingBrand.name}"
                </span>
                ? This action cannot be undone.
              </Text>
            </div>
            <div className="flex items-center justify-end gap-x-2 py-4 border-t">
              <Button
                variant="secondary"
                onClick={() => {
                  setIsDeleteDialogOpen(false);
                  setDeletingBrand(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleDeleteConfirm}
                isLoading={deleteMutation.isPending}
              >
                Delete
              </Button>
            </div>
          </Container>
        </div>
      )}
    </Container>
  );
};

export const config = defineRouteConfig({
  label: "Brands",
  icon: Tag,
});

export default BrandsPage;
