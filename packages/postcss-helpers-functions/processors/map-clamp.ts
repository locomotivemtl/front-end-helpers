/**
 * PostCSS helper: Replace map-clamp(value, start1, stop1, start2, stop2) with map math expression
 */
export default function mapClamp(value: string): string {
    if (!value.includes('map-clamp(')) {
        return value;
    }

    const mapRangeClampPattern = /map-clamp\(/g;
    const matches = [];

    // Collect all matches first
    let match;
    while ((match = mapRangeClampPattern.exec(value)) !== null) {
        matches.push(match.index);
    }

    // Process matches in reverse order to avoid index shifting
    for (let idx = matches.length - 1; idx >= 0; idx--) {
        const startIdx = matches[idx];
        const funcName = 'map-clamp(';

        // Find the matching closing parenthesis by counting depth
        let depth = 1;
        let i = startIdx + funcName.length;
        let content = '';

        // Extract content between parentheses
        while (i < value.length && depth > 0) {
            const char = value[i];
            if (char === '(') {
                depth++;
                content += char;
            } else if (char === ')') {
                depth--;
                if (depth > 0) {
                    // Still inside nested parentheses
                    content += char;
                }
                // If depth === 0, we've found the closing paren - don't add it
            } else {
                content += char;
            }
            i++;
        }

        if (depth !== 0) {
            // Unmatched parentheses, skip this match
            console.warn('map-clamp: unmatched parentheses, depth:', depth);
            continue;
        }

        // Split on commas not inside parentheses (handles CSS vars)
        const parts = [];
        let current = '';
        let parens = 0;

        for (const char of content) {
            if (char === '(') {
                parens++;
                current += char;
            } else if (char === ')') {
                parens--;
                current += char;
            } else if (char === ',') {
                if (parens === 0) {
                    // Split here - we're at top level
                    const trimmed = current.trim();
                    if (trimmed) {
                        parts.push(trimmed);
                    }
                    current = '';
                } else {
                    // Inside nested parentheses, keep the comma
                    current += char;
                }
            } else {
                current += char;
            }
        }

        // Add the last part
        const trimmed = current.trim();
        if (trimmed) {
            parts.push(trimmed);
        }

        if (parts.length !== 5) {
            console.warn(`map-clamp expects 5 arguments, got ${parts.length}:`, parts);
            console.warn('Content was:', JSON.stringify(content));
            console.warn('Full value was:', JSON.stringify(value.substring(startIdx, i)));
            continue;
        }

        const [val, start1, stop1, start2, stop2] = parts;
        const min = `min(${start2}, ${stop2})`;
        const max = `max(${start2}, ${stop2})`;
        const replacement = `clamp(${min}, calc(${start2} + (${stop2} - ${start2}) * ((${val} - ${start1}) / (${stop1} - ${start1}))), ${max})`;

        // Replace the entire function call
        value = value.substring(0, startIdx) + replacement + value.substring(i);
    }

    return value;
}
