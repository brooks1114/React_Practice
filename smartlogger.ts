import winston from 'winston';

// Store unique rule logs per test execution
const loggedRules = new Set<string>();

// Winston Logger Setup
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console(), // Debugging
        new winston.transports.File({ filename: 'business_rules.log', level: 'info' })
    ],
});

// Function to log unique business rules
const logBusinessRule = (ruleNumber: string, data: Record<string, any>) => {
    const ruleKey = JSON.stringify({ ruleNumber, data });

    if (!loggedRules.has(ruleKey)) {
        loggedRules.add(ruleKey); // Store unique rule log
    }
};

// Function to write all collected logs at the end of the test
const saveLogsToFile = () => {
    if (loggedRules.size > 0) {
        const logEntries = Array.from(loggedRules).map((rule) => ({
            timestamp: new Date().toISOString(),
            ...JSON.parse(rule),
        }));

        logEntries.forEach(entry => logger.info(entry)); // Write logs in batch
        loggedRules.clear(); // Reset log storage for the next test
    }
};




import { test, expect } from '@playwright/test';

test('Execute business rules test', async ({ page }) => {
    await page.goto('https://example.com');

    logBusinessRule('R001', { user: 'JohnDoe', action: 'quote', status: 'success' });
    logBusinessRule('R002', { user: 'JohnDoe', action: 'quote', status: 'failure' });

    // Some test actions...

    // Save logs to file at the end of the test
    saveLogsToFile();
});


for (let i = 0; i < 50; i++) {
    test(`Run test iteration ${i}`, async ({ page }) => {
        await page.goto('https://example.com');

        logBusinessRule('R001', { user: `User${i}`, action: 'quote', status: 'success' });

        saveLogsToFile(); // Writes all unique logs from this test iteration
    });
}
