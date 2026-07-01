"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const core_1 = require("@nestjs/core");
const seed_module_1 = require("./seed.module");
const category_seed_service_1 = require("./category-seed.service");
const runSeed = async () => {
    const app = await core_1.NestFactory.create(seed_module_1.SeedModule);
    console.log('Running seeds...');
    await app.get(category_seed_service_1.CategorySeedService).run();
    console.log('✓ Default expense categories seeded');
    console.log('Seeds completed successfully.');
    await app.close();
};
void runSeed();
//# sourceMappingURL=run-seed.js.map