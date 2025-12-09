"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("@medusajs/framework/http");
const validators_1 = require("./admin/brands/validators");
const validators_2 = require("./admin/products/[id]/brand/validators");
const zod_1 = require("zod");
const validators_3 = require("./admin/products/[id]/dismiss/brand/validators");
exports.default = (0, http_1.defineMiddlewares)({
    routes: [
        {
            matcher: "/admin/brands",
            method: "POST",
            middlewares: [(0, http_1.validateAndTransformBody)(validators_1.PostAdminCreateBrand)],
        },
        {
            matcher: "/admin/brands/:id",
            method: "PUT",
            middlewares: [(0, http_1.validateAndTransformBody)(validators_1.PutAdminUpdateBrand)],
        },
        {
            matcher: "/admin/products/:id/brand",
            method: "POST",
            middlewares: [(0, http_1.validateAndTransformBody)(validators_2.PostAdminSetProductBrand)],
        },
        {
            matcher: "/admin/products/:id/dismiss/brand",
            method: "POST",
            middlewares: [(0, http_1.validateAndTransformBody)(validators_3.PostAdminDismissProductBrand)],
        },
        {
            matcher: "/admin/products",
            method: ["POST"],
            additionalDataValidator: {
                brand_id: zod_1.z.string().optional(),
            },
        },
    ],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlkZGxld2FyZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvYXBpL21pZGRsZXdhcmVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbURBR2tDO0FBQ2xDLDBEQUdtQztBQUNuQyx1RUFBa0Y7QUFDbEYsNkJBQXdCO0FBQ3hCLCtFQUE4RjtBQUU5RixrQkFBZSxJQUFBLHdCQUFpQixFQUFDO0lBQy9CLE1BQU0sRUFBRTtRQUNOO1lBQ0UsT0FBTyxFQUFFLGVBQWU7WUFDeEIsTUFBTSxFQUFFLE1BQU07WUFDZCxXQUFXLEVBQUUsQ0FBQyxJQUFBLCtCQUF3QixFQUFDLGlDQUFvQixDQUFDLENBQUM7U0FDOUQ7UUFDRDtZQUNFLE9BQU8sRUFBRSxtQkFBbUI7WUFDNUIsTUFBTSxFQUFFLEtBQUs7WUFDYixXQUFXLEVBQUUsQ0FBQyxJQUFBLCtCQUF3QixFQUFDLGdDQUFtQixDQUFDLENBQUM7U0FDN0Q7UUFDRDtZQUNFLE9BQU8sRUFBRSwyQkFBMkI7WUFDcEMsTUFBTSxFQUFFLE1BQU07WUFDZCxXQUFXLEVBQUUsQ0FBQyxJQUFBLCtCQUF3QixFQUFDLHFDQUF3QixDQUFDLENBQUM7U0FDbEU7UUFDRDtZQUNFLE9BQU8sRUFBRSxtQ0FBbUM7WUFDNUMsTUFBTSxFQUFFLE1BQU07WUFDZCxXQUFXLEVBQUUsQ0FBQyxJQUFBLCtCQUF3QixFQUFDLHlDQUE0QixDQUFDLENBQUM7U0FDdEU7UUFDRDtZQUNFLE9BQU8sRUFBRSxpQkFBaUI7WUFDMUIsTUFBTSxFQUFFLENBQUMsTUFBTSxDQUFDO1lBQ2hCLHVCQUF1QixFQUFFO2dCQUN2QixRQUFRLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRTthQUNoQztTQUNGO0tBQ0Y7Q0FDRixDQUFDLENBQUMifQ==