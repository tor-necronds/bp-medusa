"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = exports.GET = void 0;
const create_brand_1 = require("../../../workflows/create-brand");
const GET = async (req, res) => {
    const query = req.scope.resolve("query");
    const { data: brands } = await query.graph({
        entity: "brand",
        fields: ["*", "products.*"],
    });
    res.json({ brands });
};
exports.GET = GET;
const POST = async (req, res) => {
    const { result } = await (0, create_brand_1.createBrandWorkflow)(req.scope).run({
        input: req.validatedBody,
    });
    res.json({ brand: result });
};
exports.POST = POST;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2FkbWluL2JyYW5kcy9yb3V0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxrRUFBc0U7QUFTL0QsTUFBTSxHQUFHLEdBQUcsS0FBSyxFQUFFLEdBQWtCLEVBQUUsR0FBbUIsRUFBRSxFQUFFO0lBQ25FLE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBRXpDLE1BQU0sRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEdBQUcsTUFBTSxLQUFLLENBQUMsS0FBSyxDQUFDO1FBQ3pDLE1BQU0sRUFBRSxPQUFPO1FBQ2YsTUFBTSxFQUFFLENBQUMsR0FBRyxFQUFFLFlBQVksQ0FBQztLQUM1QixDQUFDLENBQUM7SUFFSCxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztBQUN2QixDQUFDLENBQUM7QUFUVyxRQUFBLEdBQUcsT0FTZDtBQUVLLE1BQU0sSUFBSSxHQUFHLEtBQUssRUFDdkIsR0FBNEMsRUFDNUMsR0FBbUIsRUFDbkIsRUFBRTtJQUNGLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxNQUFNLElBQUEsa0NBQW1CLEVBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQztRQUMxRCxLQUFLLEVBQUUsR0FBRyxDQUFDLGFBQWE7S0FDekIsQ0FBQyxDQUFDO0lBRUgsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDO0FBQzlCLENBQUMsQ0FBQztBQVRXLFFBQUEsSUFBSSxRQVNmIn0=