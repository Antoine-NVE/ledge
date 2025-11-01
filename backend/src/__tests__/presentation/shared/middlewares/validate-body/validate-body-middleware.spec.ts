import { Request, Response } from 'express';
import { validateBody } from '../../../../../presentation/shared/middlewares/validate-body/validate-body-middleware';
import { z } from 'zod';
import { BadRequestError } from '../../../../../infrastructure/errors/bad-request-error';

describe('validateBody middleware', () => {
    const mockRequest = (body: unknown) =>
        ({
            body,
        }) as Request;

    const mockResponse = () => {
        const res: Partial<Response> = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res as Response;
    };

    const mockNext = jest.fn();

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should call next() if validation succeeds', () => {
        const schema = z.object({
            name: z.string(),
            age: z.number(),
        });

        const req = mockRequest({ name: 'John', age: 30 });
        const res = mockResponse();

        validateBody(schema)(req, res, mockNext);

        expect(mockNext).toHaveBeenCalled();
        expect(req.body).toEqual({ name: 'John', age: 30 });
    });

    it('should throw BadRequestError if validation fails', () => {
        const schema = z.object({
            name: z.string(),
            age: z.number(),
        });

        const req = mockRequest({ name: 'John', age: 'not-a-number' });
        const res = mockResponse();

        expect(() => validateBody(schema)(req, res, mockNext)).toThrow(
            BadRequestError,
        );
        expect(mockNext).not.toHaveBeenCalled();
    });
});
