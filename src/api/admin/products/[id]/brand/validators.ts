import { z } from "zod";

export const PostAdminSetProductBrand = z.object({
  brand_id: z.string().nullable().optional(),
});
