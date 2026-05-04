export const sanitize = (str: string) => {
    return str
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .toLowerCase();
};

export const normalizeSlashHref = (href: string) => {
    if (href.startsWith('/')) return href;
    return '/' + href;
};
