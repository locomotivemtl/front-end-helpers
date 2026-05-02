/**
 * PostCSS helper: Replace min-screen(value) with min({value}lvh, {value}vw)
 */
export default function minScreen(value: string): string {
    const minRegex = /min-screen\(([^)]+)\)/g;
    if (minRegex.test(value)) {
        return value.replace(minRegex, (_, val) => {
            return `min(${val}lvh, ${val}vw)`;
        });
    }
    return value;
}
