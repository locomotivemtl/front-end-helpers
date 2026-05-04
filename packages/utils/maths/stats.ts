export const roundToDecimals = (value: number, decimals: number): number => {
    const factor = Math.pow(10, decimals);
    return Math.round((value + Number.EPSILON) * factor) / factor;
};

export function average(values: number[]) {
    let val = 0;
    const len = values.length;
    for (let i = 0; i < len; i++) val += values[i];
    return val / len;
}

export function median(values: number[] = []) {
    const numbers = values.slice(0).sort((a, b) => a - b);
    const middle = Math.floor(numbers.length / 2);
    const isEven = numbers.length % 2 === 0;
    return isEven ? (numbers[middle] + numbers[middle - 1]) / 2 : numbers[middle];
}
