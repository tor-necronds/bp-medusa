import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { Modules } from "@medusajs/framework/utils";
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { BRAND_MODULE } from "../../../../../../modules/brand";
import { container } from "@medusajs/framework";

type AdminSetProductBrandReq = {
  brand_id: string;
};

export const POST = async (
  req: MedusaRequest<AdminSetProductBrandReq>,
  res: MedusaResponse
) => {
  const link = container.resolve("link");
  const { id } = req.params;
  const { brand_id } = req.validatedBody;

  await link.dismiss({
    [Modules.PRODUCT]: { product_id: id },
    [BRAND_MODULE]: { brand_id },
  });

  res.sendStatus(200);
};
