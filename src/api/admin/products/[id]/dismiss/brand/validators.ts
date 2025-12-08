import { z } from "zod";

export const PostAdminDismissProductBrand = z.object({
  brand_id: z.string().nullable().optional(),
});
