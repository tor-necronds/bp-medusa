"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = void 0;
const utils_1 = require("@medusajs/framework/utils");
const brand_1 = require("../../../../../../modules/brand");
const framework_1 = require("@medusajs/framework");
const POST = async (req, res) => {
    const link = framework_1.container.resolve("link");
    const { id } = req.params;
    const { brand_id } = req.validatedBody;
    await link.dismiss({
        [utils_1.Modules.PRODUCT]: { product_id: id },
        [brand_1.BRAND_MODULE]: { brand_id },
    });
    res.sendStatus(200);
};
exports.POST = POST;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2FkbWluL3Byb2R1Y3RzL1tpZF0vZGlzbWlzcy9icmFuZC9yb3V0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxxREFBb0Q7QUFFcEQsMkRBQStEO0FBQy9ELG1EQUFnRDtBQU16QyxNQUFNLElBQUksR0FBRyxLQUFLLEVBQ3ZCLEdBQTJDLEVBQzNDLEdBQW1CLEVBQ25CLEVBQUU7SUFDRixNQUFNLElBQUksR0FBRyxxQkFBUyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN2QyxNQUFNLEVBQUUsRUFBRSxFQUFFLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQztJQUMxQixNQUFNLEVBQUUsUUFBUSxFQUFFLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQztJQUV2QyxNQUFNLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDakIsQ0FBQyxlQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxVQUFVLEVBQUUsRUFBRSxFQUFFO1FBQ3JDLENBQUMsb0JBQVksQ0FBQyxFQUFFLEVBQUUsUUFBUSxFQUFFO0tBQzdCLENBQUMsQ0FBQztJQUVILEdBQUcsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDdEIsQ0FBQyxDQUFDO0FBZFcsUUFBQSxJQUFJLFFBY2YifQ==