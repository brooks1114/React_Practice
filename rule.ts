TypeError[ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for C: \Users\N0161651\REPO\ronin - auto - playwright - automation\scripts\generateRules.ts
    at Object.getFileProtocolModuleFormat[as file:](node: internal/modules/esm / get_format: 160: 9)
    at defaultGetFormat(node: internal / modules / esm / get_format: 203: 36)
    at defaultLoad(node: internal / modules / esm / load: 143: 22)
    at async ModuleLoader.load(node: internal / modules / esm / loader: 396: 7)
    at async ModuleLoader.moduleProvider(node: internal / modules / esm / loader: 278: 45)
    at async link(node: internal / modules / esm / module_job: 78: 21) {
    code: 'ERR_UNKNOWN_FILE_EXTENSION'
}

Node.js v20.13.1
PS C: \Users\N0161651\REPO\ronin - auto - playwright - automation > node scripts / generateRules.js
file:///C:/Users/N0161651/REPO/ronin-auto-playwright-automation/scripts/generateRules.js:11
Object.defineProperty(exports, "__esModule", { value: true });
                      ^

    ReferenceError: exports is not defined in ES module scope
This file is being treated as an ES module because it has a '.js' file extension and 'C:\Users\N0161651\REPO\ronin-auto-playwright-automation\package.json' contains "type": "module".To treat it as a CommonJS script, rename it to use the '.cjs' file extension.
    at file:///C:/Users/N0161651/REPO/ronin-auto-playwright-automation/scripts/generateRules.js:11:23
    at ModuleJob.run(node: internal / modules / esm / module_job: 222: 25)
    at async ModuleLoader.import(node: internal / modules / esm / loader: 316: 24)
    at async asyncRunEntryPointWithESMLoader(node: internal / modules / run_main: 123: 5)

Node.js v20.13.1