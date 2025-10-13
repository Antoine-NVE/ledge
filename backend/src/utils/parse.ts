export const parseNumber = (value: string | undefined): number | undefined => {
    if (value === undefined) return undefined;
    const number = Number(value);
    return isNaN(number) ? undefined : number;
};

export const parseBoolean = (
    value: string | undefined,
): boolean | undefined => {
    if (value === undefined) return undefined;
    if (value === 'true') return true;
    if (value === 'false') return false;
    return undefined;
};

export const parseArray = (value: string | undefined): string[] | undefined => {
    if (value === undefined) return undefined;
    return value.split(',');
};
