export const toDash = (str: string) =>
    str
        .split(/(?=[A-Z])/)
        .join('-')
        .toLowerCase();

export const kamelCaseToDash = (str: string) => {
    return str
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .trim()
        .toLowerCase();
};

export const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

export const lcfirst = (str = '') => str[0].toLowerCase() + str.slice(1);
