/** Split a string by top-level commas, ignoring commas inside parentheses. */
export function splitArgs(input: string): string[] {
    const result: string[] = [];
    let current = '';
    let depth = 0;

    for (const char of input) {
        if (char === '(') depth++;
        else if (char === ')') depth--;

        if (char === ',' && depth === 0) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }

    result.push(current.trim());
    return result;
}

/**
 * Find all `processor_name(...)` calls in a CSS value string and replace them.
 * Handles nested parentheses (e.g. CSS vars with fallbacks).
 * Return null from transform to leave the call unchanged.
 */
export function replaceCSSFunction(
    value: string,
    name: string,
    transform: (args: string[]) => string | null
): string {
    const keyword = `${name}(`;
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

        const contentStart = start + keyword.length;
        let depth = 1;
        let j = contentStart;

        while (j < value.length && depth > 0) {
            if (value[j] === '(') depth++;
            else if (value[j] === ')') depth--;
            j++;
        }

        const args = splitArgs(value.slice(contentStart, j - 1));
        const replacement = transform(args);
        result += replacement ?? value.slice(start, j);
        i = j;
    }

    return result;
}
