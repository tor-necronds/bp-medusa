import { z } from "zod";

export const PostAdminCreateBrand = z.object({
  name: z.string(),
});

export const PutAdminUpdateBrand = z.object({
  name: z.string(),
});
