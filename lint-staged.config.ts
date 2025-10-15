export default {
  "*.ts": [
    "tsc-files",
    "biome check --no-errors-on-unmatched",
    "node --experimental-vm-modules ./node_modules/jest/bin/jest.js --findRelatedTests --bail",
  ],
  "*.{json,jsonc}": ["biome check --no-errors-on-unmatched"],
};
