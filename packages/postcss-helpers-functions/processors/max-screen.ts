/**
 * PostCSS helper: Replace max-screen(value) with max({value}lvh, {value}vw)
 */
export default function maxScreen(value: string): string {
    const maxRegex = /max-screen\(([^)]+)\)/g;
    if (maxRegex.test(value)) {
        return value.replace(maxRegex, (_, val) => {
            return `max(${val}lvh, ${val}vw)`;
        });
    }
    return value;
}
