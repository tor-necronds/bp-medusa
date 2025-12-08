// src/api/admin/products/:id/brand/route.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { Modules } from "@medusajs/framework/utils";
import { BRAND_MODULE } from "../../../../../modules/brand";

type AdminSetProductBrandReq = {
  brand_id: string;
};

export const POST = async (
  req: MedusaRequest<AdminSetProductBrandReq>,
  res: MedusaResponse
) => {
  const { id } = req.params;
  const { brand_id } = req.validatedBody;

  const container = req.scope;
  const brandModuleService = container.resolve(BRAND_MODULE);
  const link = container.resolve("link");

  // confirm brand exists (pattern เดียวกับ hook)
  await brandModuleService.retrieveBrand(brand_id);

  // Try to create the link first
  // If it fails (e.g., link already exists), dismiss existing links and retry
  try {
    await link.create([
      {
        [Modules.PRODUCT]: { product_id: id },
        [BRAND_MODULE]: { brand_id },
      },
    ]);
  } catch (createError: any) {
    // If create fails, try to dismiss any existing brand links first
    // We'll try to dismiss with the new brand_id (in case it's the same)
    // and also try to dismiss without specifying brand_id if possible
    try {
      // Try dismissing with the new brand_id first
      await link.dismiss({
        [Modules.PRODUCT]: { product_id: id },
        [BRAND_MODULE]: { brand_id },
      });
    } catch (dismissError) {
      // If dismiss fails, it might mean there's no link or different brand
      // We'll continue and try to create again
    }

    // Retry creating the link
    await link.create([
      {
        [Modules.PRODUCT]: { product_id: id },
        [BRAND_MODULE]: { brand_id },
      },
    ]);
  }

  res.json({ product_id: id, brand_id });
};
