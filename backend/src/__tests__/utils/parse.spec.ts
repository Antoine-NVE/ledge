import { parseArray, parseBoolean, parseNumber } from '../../utils/parse';

describe('parse utils', () => {
    describe('parseNumber()', () => {
        it('should parse valid number strings', () => {
            expect(parseNumber('42')).toBe(42);
            expect(parseNumber('3.14')).toBe(3.14);
        });

        it('should return undefined for invalid number strings', () => {
            expect(parseNumber('abc')).toBeUndefined();
            expect(parseNumber('')).toBeUndefined();
            expect(parseNumber(undefined)).toBeUndefined();
        });
    });

    describe('parseBoolean()', () => {
        it('should parse valid boolean strings', () => {
            expect(parseBoolean('true')).toBe(true);
            expect(parseBoolean('false')).toBe(false);
        });

        it('should return undefined for invalid boolean strings', () => {
            expect(parseBoolean('yes')).toBeUndefined();
            expect(parseBoolean('no')).toBeUndefined();
            expect(parseBoolean('')).toBeUndefined();
            expect(parseBoolean(undefined)).toBeUndefined();
        });
    });

    describe('parseArray()', () => {
        it('should parse comma-separated strings into arrays', () => {
            expect(parseArray('a,b,c')).toEqual(['a', 'b', 'c']);
            expect(parseArray('1,2,3')).toEqual(['1', '2', '3']);
        });

        it('should return undefined for undefined input', () => {
            expect(parseArray(undefined)).toBeUndefined();
        });

        it('should return an array with a single empty string for empty input', () => {
            expect(parseArray('')).toEqual(['']);
        });
    });
});
