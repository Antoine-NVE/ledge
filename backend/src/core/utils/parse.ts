export const parseNumber = (value: string | undefined): number | null => {
    if (!value) return null;
    const number = Number(value);
    return isNaN(number) ? null : number;
};

export const parseBoolean = (value: string | undefined): boolean | null => {
    if (!value) return null;
    if (value === 'true') return true;
    if (value === 'false') return false;
    return null;
};

export const parseArray = (value: string | undefined): string[] | null => {
    if (!value) return null;
    return value.split(',');
};
