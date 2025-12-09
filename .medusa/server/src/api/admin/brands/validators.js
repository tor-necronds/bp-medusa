"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PutAdminUpdateBrand = exports.PostAdminCreateBrand = void 0;
const zod_1 = require("zod");
exports.PostAdminCreateBrand = zod_1.z.object({
    name: zod_1.z.string(),
});
exports.PutAdminUpdateBrand = zod_1.z.object({
    name: zod_1.z.string(),
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdG9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9hcGkvYWRtaW4vYnJhbmRzL3ZhbGlkYXRvcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNkJBQXdCO0FBRVgsUUFBQSxvQkFBb0IsR0FBRyxPQUFDLENBQUMsTUFBTSxDQUFDO0lBQzNDLElBQUksRUFBRSxPQUFDLENBQUMsTUFBTSxFQUFFO0NBQ2pCLENBQUMsQ0FBQztBQUVVLFFBQUEsbUJBQW1CLEdBQUcsT0FBQyxDQUFDLE1BQU0sQ0FBQztJQUMxQyxJQUFJLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRTtDQUNqQixDQUFDLENBQUMifQ==