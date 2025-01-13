// Rule Metadata:
// Given:
//   OR:
//     - Transaction type, is, Transfer.
//     - Transaction type, is, Rewrite AND
//         - Current active page, is, Quote Summary Page AND
//         - Visit count on Quote Summary Page, is less than or equal to, 1 AND
//         - (Rating program code, is, Omega2 OR Rating program code, is, Omega1) AND
//         - (Rewrite reason, is, Default Data Input Value OR Rewrite reason, is, Rewrite Reason 1st Nonpay)
// When: System, evaluates, rule conditions.
// Then: Expected element, is, visible.

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
