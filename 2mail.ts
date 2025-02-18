import { createLogger, format, transports } from "winston";
import path from "path";
import { BUSINESS_RULE_KEYS, BusinessRuleKey } from "./logger-constants"
/**
 * Helper function to format the timestamp in dd-MM-yyyy-HH-mm-ss.
 */
// function getFormattedTimestamp(): string {
//     const now = new Date();
//     const day = String(now.getDate()).padStart(2, "0");
//     const month = String(now.getMonth() + 1).padStart(2, "0");
//     const year = now.getFullYear();
//     const hours = String(now.getHours()).padStart(2, "0");
//     const minutes = String(now.getMinutes()).padStart(2, "0");
//     const seconds = String(now.getSeconds()).padStart(2, "0");
//     return `${day}-${month}-${year}-${hours}-${minutes}-${seconds}`;
// }

// Define the custom logger
class BusinessRuleTracer {
    private logger;

    constructor() {
        this.logger = createLogger({
            level: "info",
            format: format.combine(
                format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
                format.json() // Output logs in JSON format
            ),
            transports: [
                new transports.File({
                    filename: path.join(__dirname, "businessRuleTrace.log"),

                    level: "info",
                }),
            ],
        });
    }

    /**
     * Log the rule and its associated key-value pairs.
     * @param ruleNumber - The rule number (e.g., 1, 24).
     * @param keyValuePairs - Array of key-value pairs using keys from the constants file.
     */
    logRule(
        ruleNumber: number,
        keyValuePairs: { key: BusinessRuleKey; value: string }[]
    ): void {
        // const timestamp = getFormattedTimestamp();
        const logEntry = {
            ruleNumber,
            // timestamp,
            keyValuePairs: keyValuePairs.map(({ key, value }) => ({
                key: BUSINESS_RULE_KEYS[key],
                value,
            })),
        };

        // this.logger.info(logEntry);
        // this.logger.info("");
    }
}

export default BusinessRuleTracer;

