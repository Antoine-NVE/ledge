import {
    parseArray,
    parseBoolean,
    parseNumber,
} from '../../../src/infrastructure/utils/parse-utils';

describe('parse utils', () => {
    describe('parseNumber', () => {
        it('should parse a valid number', () => {
            expect(parseNumber('3')).toBe(3);
            expect(parseNumber('3.14')).toBe(3.14);
            expect(parseNumber('-4')).toBe(-4);
        });

        it('should return undefined for an invalid number', () => {
            expect(parseNumber('')).toBeUndefined();
            expect(parseNumber(undefined)).toBeUndefined();
            expect(parseNumber('hello')).toBeUndefined();
        });
    });

    describe('parseBoolean', () => {
        it('should parse a valid boolean', () => {
            expect(parseBoolean('true')).toBe(true);
            expect(parseBoolean('false')).toBe(false);
        });

        it('should return undefined for an invalid boolean', () => {
            expect(parseBoolean('yes')).toBeUndefined();
            expect(parseBoolean('')).toBeUndefined();
            expect(parseBoolean(undefined)).toBeUndefined();
        });
    });

    describe('parseArray', () => {
        it('should parse a valid array', () => {
            expect(parseArray('test,hello,here')).toEqual([
                'test',
                'hello',
                'here',
            ]);
            expect(parseArray('123,456,789')).toEqual(['123', '456', '789']);
            expect(parseArray('yay,123,true')).toEqual(['yay', '123', 'true']);
        });

        it('should return undefined for an invalid array', () => {
            expect(parseArray('')).toBeUndefined();
            expect(parseArray(undefined)).toBeUndefined();
        });
    });
});
