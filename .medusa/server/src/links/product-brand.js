"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const brand_1 = __importDefault(require("../modules/brand"));
const product_1 = __importDefault(require("@medusajs/medusa/product"));
const utils_1 = require("@medusajs/framework/utils");
exports.default = (0, utils_1.defineLink)({
    linkable: product_1.default.linkable.product,
    isList: true,
}, brand_1.default.linkable.brand);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZHVjdC1icmFuZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saW5rcy9wcm9kdWN0LWJyYW5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsNkRBQTBDO0FBQzFDLHVFQUFvRDtBQUNwRCxxREFBc0Q7QUFFdEQsa0JBQWUsSUFBQSxrQkFBVSxFQUN2QjtJQUNFLFFBQVEsRUFBRSxpQkFBYSxDQUFDLFFBQVEsQ0FBQyxPQUFPO0lBQ3hDLE1BQU0sRUFBRSxJQUFJO0NBQ2IsRUFDRCxlQUFXLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FDM0IsQ0FBQSJ9