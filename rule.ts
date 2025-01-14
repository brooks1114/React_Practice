


export const BUSINESS_RULE_KEYS = {
    CUSTOMER: "customer",
    RATING_PROGRAM_CODE: "ratingProgramCode",
    USER_LOCATION: "userLocation",
    PURCHASE: "purchase",
    ACCOUNT: "account",
    DISCOUNT: "discount",
} as const;

export type BusinessRuleKey = keyof typeof BUSINESS_RULE_KEYS;




import { createLogger, format, transports } from "winston";
import path from "path";
import { BUSINESS_RULE_KEYS, BusinessRuleKey } from "./constants";

/**
 * Helper function to format the timestamp in dd-MM-yyyy-HH-mm-ss.
 */
function getFormattedTimestamp(): string {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    return `${day}-${month}-${year}-${hours}-${minutes}-${seconds}`;
}

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
                    filename: path.join(__dirname, "businessRuleTrace.json"), // JSON output file
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
        const timestamp = getFormattedTimestamp();
        const logEntry = {
            ruleNumber,
            timestamp,
            keyValuePairs: keyValuePairs.map(({ key, value }) => ({
                key: BUSINESS_RULE_KEYS[key],
                value,
            })),
        };

        this.logger.info(logEntry);
    }
}

export default BusinessRuleTracer;



import BusinessRuleTracer from "../../../../logger/logger";

getBusinessRuleTracer(): BusinessRuleTracer {
    return new BusinessRuleTracer()
}

const tracer = new BusinessRuleTracer();


import BusinessRuleTracer from "./BusinessRuleTracer";
import { BUSINESS_RULE_KEYS } from "./constants";

// Create an instance of the logger


// Log rule 1 with an array of key-value pairs
tracer.logRule(1, [
    { key: "CUSTOMER", value: "loyaltyMember" },
    { key: "RATING_PROGRAM_CODE", value: "Omega1" },
]);

// Log rule 24 with a different array
tracer.logRule(24, [
    { key: "PURCHASE", value: "exceeds 500 USD" },
    { key: "ACCOUNT", value: "has activePromoCode" },
]);

// The JSON log file will automatically map the constants to their string values


tracer.logRule(3, [
    { key: "JURS", value: bt.jurisdiction },
    { key: "RATING_PROGRAM_CODE", value: bt.ratingProgramCode },
    { key: "USER_DISTRIBUTION_CHANNEL", value: bt.currentUserDistributionChannel },
]);



