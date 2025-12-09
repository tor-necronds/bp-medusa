"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_flows_1 = require("@medusajs/medusa/core-flows");
const workflows_sdk_1 = require("@medusajs/framework/workflows-sdk");
const utils_1 = require("@medusajs/framework/utils");
const brand_1 = require("../../modules/brand");
core_flows_1.createProductsWorkflow.hooks.productsCreated(async ({ products, additional_data }, { container }) => {
    if (!additional_data?.brand_id) {
        return new workflows_sdk_1.StepResponse([], []);
    }
    const brandModuleService = container.resolve(brand_1.BRAND_MODULE);
    // if the brand doesn't exist, an error is thrown.
    await brandModuleService.retrieveBrand(additional_data.brand_id);
    const link = container.resolve("link");
    const logger = container.resolve("logger");
    const links = [];
    for (const product of products) {
        links.push({
            [utils_1.Modules.PRODUCT]: {
                product_id: product.id,
            },
            [brand_1.BRAND_MODULE]: {
                brand_id: additional_data.brand_id,
            },
        });
    }
    await link.create(links);
    logger.info("Linked brand to products");
    return new workflows_sdk_1.StepResponse(links, links);
}, async (links, { container }) => {
    if (!links?.length) {
        return;
    }
    const link = container.resolve("link");
    await link.dismiss(links);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlZC1wcm9kdWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL3dvcmtmbG93cy9ob29rcy9jcmVhdGVkLXByb2R1Y3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw0REFBcUU7QUFDckUscUVBQWlFO0FBQ2pFLHFEQUFvRDtBQUVwRCwrQ0FBbUQ7QUFHbkQsbUNBQXNCLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FDMUMsS0FBSyxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQWUsRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUNyRCxJQUFJLENBQUMsZUFBZSxFQUFFLFFBQVEsRUFBRSxDQUFDO1FBQy9CLE9BQU8sSUFBSSw0QkFBWSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBRUQsTUFBTSxrQkFBa0IsR0FDdEIsU0FBUyxDQUFDLE9BQU8sQ0FBQyxvQkFBWSxDQUFDLENBQUM7SUFDbEMsa0RBQWtEO0lBQ2xELE1BQU0sa0JBQWtCLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxRQUFrQixDQUFDLENBQUM7SUFFM0UsTUFBTSxJQUFJLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN2QyxNQUFNLE1BQU0sR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBRTNDLE1BQU0sS0FBSyxHQUFxQixFQUFFLENBQUM7SUFFbkMsS0FBSyxNQUFNLE9BQU8sSUFBSSxRQUFRLEVBQUUsQ0FBQztRQUMvQixLQUFLLENBQUMsSUFBSSxDQUFDO1lBQ1QsQ0FBQyxlQUFPLENBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQ2pCLFVBQVUsRUFBRSxPQUFPLENBQUMsRUFBRTthQUN2QjtZQUNELENBQUMsb0JBQVksQ0FBQyxFQUFFO2dCQUNkLFFBQVEsRUFBRSxlQUFlLENBQUMsUUFBUTthQUNuQztTQUNGLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7SUFFekIsTUFBTSxDQUFDLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO0lBRXhDLE9BQU8sSUFBSSw0QkFBWSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztBQUN4QyxDQUFDLEVBQ0QsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDN0IsSUFBSSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsQ0FBQztRQUNuQixPQUFPO0lBQ1QsQ0FBQztJQUVELE1BQU0sSUFBSSxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFdkMsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzVCLENBQUMsQ0FDRixDQUFDIn0=