"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = void 0;
const utils_1 = require("@medusajs/framework/utils");
const brand_1 = require("../../../../../modules/brand");
const POST = async (req, res) => {
    const { id } = req.params;
    const { brand_id } = req.validatedBody;
    const container = req.scope;
    const brandModuleService = container.resolve(brand_1.BRAND_MODULE);
    const link = container.resolve("link");
    // confirm brand exists (pattern เดียวกับ hook)
    await brandModuleService.retrieveBrand(brand_id);
    // Try to create the link first
    // If it fails (e.g., link already exists), dismiss existing links and retry
    try {
        await link.create([
            {
                [utils_1.Modules.PRODUCT]: { product_id: id },
                [brand_1.BRAND_MODULE]: { brand_id },
            },
        ]);
    }
    catch (createError) {
        // If create fails, try to dismiss any existing brand links first
        // We'll try to dismiss with the new brand_id (in case it's the same)
        // and also try to dismiss without specifying brand_id if possible
        try {
            // Try dismissing with the new brand_id first
            await link.dismiss({
                [utils_1.Modules.PRODUCT]: { product_id: id },
                [brand_1.BRAND_MODULE]: { brand_id },
            });
        }
        catch (dismissError) {
            // If dismiss fails, it might mean there's no link or different brand
            // We'll continue and try to create again
        }
        // Retry creating the link
        await link.create([
            {
                [utils_1.Modules.PRODUCT]: { product_id: id },
                [brand_1.BRAND_MODULE]: { brand_id },
            },
        ]);
    }
    res.json({ product_id: id, brand_id });
};
exports.POST = POST;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2FkbWluL3Byb2R1Y3RzL1tpZF0vYnJhbmQvcm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEscURBQW9EO0FBQ3BELHdEQUE0RDtBQU9yRCxNQUFNLElBQUksR0FBRyxLQUFLLEVBQ3ZCLEdBQTJDLEVBQzNDLEdBQW1CLEVBQ25CLEVBQUU7SUFDRixNQUFNLEVBQUUsRUFBRSxFQUFFLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQztJQUMxQixNQUFNLEVBQUUsUUFBUSxFQUFFLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQztJQUV2QyxNQUFNLFNBQVMsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDO0lBQzVCLE1BQU0sa0JBQWtCLEdBQ3RCLFNBQVMsQ0FBQyxPQUFPLENBQUMsb0JBQVksQ0FBQyxDQUFDO0lBQ2xDLE1BQU0sSUFBSSxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFdkMsK0NBQStDO0lBQy9DLE1BQU0sa0JBQWtCLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBRWpELCtCQUErQjtJQUMvQiw0RUFBNEU7SUFDNUUsSUFBSSxDQUFDO1FBQ0gsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDO1lBQ2hCO2dCQUNFLENBQUMsZUFBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsVUFBVSxFQUFFLEVBQUUsRUFBRTtnQkFDckMsQ0FBQyxvQkFBWSxDQUFDLEVBQUUsRUFBRSxRQUFRLEVBQUU7YUFDN0I7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDO0lBQUMsT0FBTyxXQUFnQixFQUFFLENBQUM7UUFDMUIsaUVBQWlFO1FBQ2pFLHFFQUFxRTtRQUNyRSxrRUFBa0U7UUFDbEUsSUFBSSxDQUFDO1lBQ0gsNkNBQTZDO1lBQzdDLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQztnQkFDakIsQ0FBQyxlQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxVQUFVLEVBQUUsRUFBRSxFQUFFO2dCQUNyQyxDQUFDLG9CQUFZLENBQUMsRUFBRSxFQUFFLFFBQVEsRUFBRTthQUM3QixDQUFDLENBQUM7UUFDTCxDQUFDO1FBQUMsT0FBTyxZQUFZLEVBQUUsQ0FBQztZQUN0QixxRUFBcUU7WUFDckUseUNBQXlDO1FBQzNDLENBQUM7UUFFRCwwQkFBMEI7UUFDMUIsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDO1lBQ2hCO2dCQUNFLENBQUMsZUFBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsVUFBVSxFQUFFLEVBQUUsRUFBRTtnQkFDckMsQ0FBQyxvQkFBWSxDQUFDLEVBQUUsRUFBRSxRQUFRLEVBQUU7YUFDN0I7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLFVBQVUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQztBQUN6QyxDQUFDLENBQUM7QUFqRFcsUUFBQSxJQUFJLFFBaURmIn0=