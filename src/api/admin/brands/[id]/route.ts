import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { PutAdminUpdateBrand } from "../validators";
import { z } from "zod";
import { BRAND_MODULE } from "../../../../modules/brand";
import BrandModuleService from "../../../../modules/brand/service";

type PutAdminUpdateBrandType = z.infer<typeof PutAdminUpdateBrand>;

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params;
  const container = req.scope;
  const brandModuleService: BrandModuleService =
    container.resolve(BRAND_MODULE);

  const brand = await brandModuleService.retrieveBrand(id);

  res.json({ brand });
};

export const PUT = async (
  req: MedusaRequest<PutAdminUpdateBrandType>,
  res: MedusaResponse
) => {
  const { id } = req.params;
  const container = req.scope;
  const brandModuleService: BrandModuleService =
    container.resolve(BRAND_MODULE);

  // First verify the brand exists
  await brandModuleService.retrieveBrand(id);

  // MedusaService.updateBrands expects an array of objects with id and update data
  const updatedBrands = await brandModuleService.updateBrands([
    {
      id,
      ...req.validatedBody,
    },
  ]);

  // updateBrands returns an array, get the first element
  const brand = Array.isArray(updatedBrands) ? updatedBrands[0] : updatedBrands;

  res.json({ brand });
};

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params;
  const container = req.scope;
  const brandModuleService: BrandModuleService =
    container.resolve(BRAND_MODULE);

  await brandModuleService.deleteBrands(id);

  res.json({ id, deleted: true });
};
