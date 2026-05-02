/**
 * PostCSS helper: Replace interpolate(value) with a linear interpolation between two values based on a percentage
 */

export default function interpolate(value: string): string {
    const keyword = 'interpolate(';
    if (!value.includes(keyword)) return value;

    let result = '';
    let i = 0;

    while (i < value.length) {
        const start = value.indexOf(keyword, i);
        if (start === -1) {
            result += value.slice(i);
            break;
        }

        result += value.slice(i, start);

        // Find the matching closing parenthesis
        const contentStart = start + keyword.length;
        let depth = 1;
        let j = contentStart;
        while (j < value.length && depth > 0) {
            if (value[j] === '(') depth++;
            else if (value[j] === ')') depth--;
            j++;
        }

        const args = value.slice(contentStart, j - 1);
        const parts = splitArgs(args);

        if (parts.length === 3) {
            const [a, b, t] = parts.map((s) => s.trim());
            result += `calc(${a} * (1 - ${t}) + ${b} * ${t})`;
        } else {
            result += value.slice(start, j);
        }

        i = j;
    }

    return result;
}

/** Split a string by commas, ignoring commas nested inside parentheses. */
function splitArgs(input: string): string[] {
    const result: string[] = [];
    let current = '';
    let depth = 0;
    for (const char of input) {
        if (char === '(') depth++;
        else if (char === ')') depth--;

        if (char === ',' && depth === 0) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current);
    return result;
}
