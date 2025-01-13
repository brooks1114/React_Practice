
npm install--save - dev ts - node typescript

npx ts - node scripts / generateRules.ts

package.json:
{
    "scripts": {
        "generate-rules": "ts-node scripts/generateRules.ts"
    }
}

npm run generate - rules




{
    "compilerOptions": {
        "target": "ES2020",                  // Specify ECMAScript target version
            "module": "CommonJS",               // Module system (use CommonJS for Node.js compatibility)
                "strict": true,                     // Enable strict type checking
                    "esModuleInterop": true,            // Allow default imports from CommonJS modules
                        "forceConsistentCasingInFileNames": true, // Enforce consistent file naming
                            "skipLibCheck": true,               // Skip checking of declaration files
                                "resolveJsonModule": true,          // Allow importing JSON files
                                    "outDir": "./dist",                 // Output directory for compiled files
                                        "rootDir": "./",                    // Root directory of input files
                                            "moduleResolution": "node"          // Use Node.js module resolution
    },
    "include": ["scripts/**/*.ts", "src/**/*.ts"], // Include all TS files in scripts and src folders
        "exclude": ["node_modules", "dist"]           // Exclude unnecessary folders
}
