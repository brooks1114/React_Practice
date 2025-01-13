const fs = require('fs');
const path = require('path');

// Directory containing source files
const SOURCE_DIR = path.join(__dirname, '../src/components');
// Output files
const JSON_OUTPUT = path.join(__dirname, '../rules.json');
const MARKDOWN_OUTPUT = path.join(__dirname, '../RULES.md');

/**
 * Parses a simplified condition string into a structured object.
 * @param {string} statement - The condition string.
 * @returns {object} - The parsed structure.
 */
function parseCondition(statement) {
    const logicalKeywords = ['AND', 'OR'];
    const regex = /\s*(AND|OR|[\(\)])\s*|([^ANDOR\(\)\s,]+)\s*,\s*([^,]+)\s*,\s*([^,\(\)]+)\s*/g;
    const tokens = [...statement.matchAll(regex)].map(([_, operator, subject, action, noun]) => {
        if (operator) return operator;
        return { subject: subject.trim(), action: action.trim(), noun: noun.trim() };
    });

    function buildTree(tokens) {
        const stack = [];
        const result = [];

        tokens.forEach((token) => {
            if (typeof token === 'string' && (token === 'AND' || token === 'OR' || token === '(')) {
                stack.push(token);
            } else if (token === ')') {
                let group = [];
                while (stack.length && stack[stack.length - 1] !== '(') {
                    group.unshift(stack.pop());
                }
                stack.pop(); // Remove '('
                const operator = stack.pop();
                if (operator) {
                    group = { [operator]: group };
                }
                stack.push(group);
            } else {
                stack.push(token);
            }
        });

        while (stack.length) {
            result.unshift(stack.pop());
        }
        return result.length === 1 ? result[0] : result;
    }

    return buildTree(tokens);
}

/**
 * Reads metadata from files, parses it, and generates outputs.
 */
function generateRules() {
    const files = fs.readdirSync(SOURCE_DIR).filter((file) => file.endsWith('.ts'));
    const rules = [];

    files.forEach((file) => {
        const filePath = path.join(SOURCE_DIR, file);
        const content = fs.readFileSync(filePath, 'utf-8');

        // Regex to extract metadata
        const metadataRegex = /\/\/ Rule Metadata:\s*Given:\s*(.*?)\s*When:\s*(.*?)\s*Then:\s*(.*)/gs;
        const matches = [...content.matchAll(metadataRegex)];

        matches.forEach((match, index) => {
            const [_, given, when, then] = match;
            const parsedGiven = parseCondition(given);

            rules.push({
                ruleId: `${path.basename(file, '.ts')}_${index + 1}`,
                file: filePath,
                given: parsedGiven,
                when: when.trim(),
                then: then.trim(),
            });
        });
    });

    // Generate JSON
    fs.writeFileSync(JSON_OUTPUT, JSON.stringify(rules, null, 2));
    console.log(`Rules JSON written to ${JSON_OUTPUT}`);

    // Generate Markdown
    const markdown = rules
        .map(
            (rule) => `## Rule ${rule.ruleId}
- **File**: ${rule.file}
- **Given**: ${JSON.stringify(rule.given, null, 2)}
- **When**: ${rule.when}
- **Then**: ${rule.then}
`
        )
        .join('\n');
    fs.writeFileSync(MARKDOWN_OUTPUT, markdown);
    console.log(`Rules Markdown written to ${MARKDOWN_OUTPUT}`);
}

generateRules();
