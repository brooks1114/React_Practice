import { createLogger, format, transports } from "winston";
import path from "path";
import { BUSINESS_RULE_KEYS, BusinessRuleKey } from "./logger-constants";

class BusinessRuleTracer {
    private logger;
    private loggedRules: Set<string>; // Store unique rule logs in memory

    constructor() {
        this.logger = createLogger({
            level: "info",
            format: format.combine(
                format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
                format.json()
            ),
            transports: [
                new transports.File({
                    filename: path.join(__dirname, "businessRuleTrace.log"),
                    level: "info",
                }),
            ],
        });

        this.loggedRules = new Set(); // Initialize storage for unique logs
    }

    /**
     * Log the rule and its associated key-value pairs.
     * @param ruleNumber - The rule number (e.g., 1, 24).
     * @param keyValuePairs - Array of key-value pairs using keys from the constants file.
     */
    logRule(ruleNumber: number, keyValuePairs: { key: BusinessRuleKey; value: string }[]): void {
        // Generate a unique identifier for deduplication (excluding timestamp)
        const logKey = JSON.stringify({ ruleNumber, keyValuePairs });

        // Only store unique rules in the set
        if (!this.loggedRules.has(logKey)) {
            this.loggedRules.add(logKey);
        }
    }

    /**
     * Writes all buffered logs to file at the end of a test.
     * This prevents excessive logging in real-time, improving test performance.
     */
    saveLogsToFile(): void {
        if (this.loggedRules.size > 0) {
            const logEntries = Array.from(this.loggedRules).map((rule) => ({
                timestamp: new Date().toISOString(),
                ...JSON.parse(rule),
            }));

            logEntries.forEach(entry => this.logger.info(entry)); // Write all unique logs in batch
            this.loggedRules.clear(); // Reset logs for the next test execution
        }
    }
}

export default BusinessRuleTracer;


const tracer = new BusinessRuleTracer();
tracer.saveLogsToFile(); // Writes all logs at the END of the test