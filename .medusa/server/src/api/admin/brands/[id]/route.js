"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DELETE = exports.PUT = exports.GET = void 0;
const brand_1 = require("../../../../modules/brand");
const GET = async (req, res) => {
    const { id } = req.params;
    const container = req.scope;
    const brandModuleService = container.resolve(brand_1.BRAND_MODULE);
    const brand = await brandModuleService.retrieveBrand(id);
    res.json({ brand });
};
exports.GET = GET;
const PUT = async (req, res) => {
    const { id } = req.params;
    const container = req.scope;
    const brandModuleService = container.resolve(brand_1.BRAND_MODULE);
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
exports.PUT = PUT;
const DELETE = async (req, res) => {
    const { id } = req.params;
    const container = req.scope;
    const brandModuleService = container.resolve(brand_1.BRAND_MODULE);
    await brandModuleService.deleteBrands(id);
    res.json({ id, deleted: true });
};
exports.DELETE = DELETE;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2FkbWluL2JyYW5kcy9baWRdL3JvdXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUdBLHFEQUF5RDtBQUtsRCxNQUFNLEdBQUcsR0FBRyxLQUFLLEVBQUUsR0FBa0IsRUFBRSxHQUFtQixFQUFFLEVBQUU7SUFDbkUsTUFBTSxFQUFFLEVBQUUsRUFBRSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUM7SUFDMUIsTUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQztJQUM1QixNQUFNLGtCQUFrQixHQUN0QixTQUFTLENBQUMsT0FBTyxDQUFDLG9CQUFZLENBQUMsQ0FBQztJQUVsQyxNQUFNLEtBQUssR0FBRyxNQUFNLGtCQUFrQixDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUV6RCxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztBQUN0QixDQUFDLENBQUM7QUFUVyxRQUFBLEdBQUcsT0FTZDtBQUVLLE1BQU0sR0FBRyxHQUFHLEtBQUssRUFDdEIsR0FBMkMsRUFDM0MsR0FBbUIsRUFDbkIsRUFBRTtJQUNGLE1BQU0sRUFBRSxFQUFFLEVBQUUsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDO0lBQzFCLE1BQU0sU0FBUyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUM7SUFDNUIsTUFBTSxrQkFBa0IsR0FDdEIsU0FBUyxDQUFDLE9BQU8sQ0FBQyxvQkFBWSxDQUFDLENBQUM7SUFFbEMsZ0NBQWdDO0lBQ2hDLE1BQU0sa0JBQWtCLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBRTNDLGlGQUFpRjtJQUNqRixNQUFNLGFBQWEsR0FBRyxNQUFNLGtCQUFrQixDQUFDLFlBQVksQ0FBQztRQUMxRDtZQUNFLEVBQUU7WUFDRixHQUFHLEdBQUcsQ0FBQyxhQUFhO1NBQ3JCO0tBQ0YsQ0FBQyxDQUFDO0lBRUgsdURBQXVEO0lBQ3ZELE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDO0lBRTlFLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO0FBQ3RCLENBQUMsQ0FBQztBQXhCVyxRQUFBLEdBQUcsT0F3QmQ7QUFFSyxNQUFNLE1BQU0sR0FBRyxLQUFLLEVBQUUsR0FBa0IsRUFBRSxHQUFtQixFQUFFLEVBQUU7SUFDdEUsTUFBTSxFQUFFLEVBQUUsRUFBRSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUM7SUFDMUIsTUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQztJQUM1QixNQUFNLGtCQUFrQixHQUN0QixTQUFTLENBQUMsT0FBTyxDQUFDLG9CQUFZLENBQUMsQ0FBQztJQUVsQyxNQUFNLGtCQUFrQixDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUUxQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQ2xDLENBQUMsQ0FBQztBQVRXLFFBQUEsTUFBTSxVQVNqQiJ9