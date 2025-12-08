import {
  defineMiddlewares,
  validateAndTransformBody,
} from "@medusajs/framework/http";
import {
  PostAdminCreateBrand,
  PutAdminUpdateBrand,
} from "./admin/brands/validators";
import { PostAdminSetProductBrand } from "./admin/products/[id]/brand/validators";
import { z } from "zod";
import { PostAdminDismissProductBrand } from "./admin/products/[id]/dismiss/brand/validators";

export default defineMiddlewares({
  routes: [
    {
      matcher: "/admin/brands",
      method: "POST",
      middlewares: [validateAndTransformBody(PostAdminCreateBrand)],
    },
    {
      matcher: "/admin/brands/:id",
      method: "PUT",
      middlewares: [validateAndTransformBody(PutAdminUpdateBrand)],
    },
    {
      matcher: "/admin/products/:id/brand",
      method: "POST",
      middlewares: [validateAndTransformBody(PostAdminSetProductBrand)],
    },
    {
      matcher: "/admin/products/:id/dismiss/brand",
      method: "POST",
      middlewares: [validateAndTransformBody(PostAdminDismissProductBrand)],
    },
    {
      matcher: "/admin/products",
      method: ["POST"],
      additionalDataValidator: {
        brand_id: z.string().optional(),
      },
    },
  ],
});
