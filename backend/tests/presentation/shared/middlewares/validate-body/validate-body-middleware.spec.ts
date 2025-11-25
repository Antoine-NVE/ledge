import { Request, Response } from 'express';
import { z } from 'zod';
import { BadRequestError } from '../../../../../src/infrastructure/errors/bad-request-error';
import { createValidateBodyMiddleware } from '../../../../../src/presentation/shared/middlewares/validate-body/validate-body-middleware';

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

    const validateBody = createValidateBodyMiddleware(
        z.object({
            name: z.string(),
            age: z.number(),
        }),
    );

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should call next() if validation succeeds', () => {
        const req = mockRequest({ name: 'John', age: 30 });
        const res = mockResponse();

        validateBody(req, res, mockNext);

        expect(mockNext).toHaveBeenCalled();
        expect(req.body).toEqual({ name: 'John', age: 30 });
    });

    it('should throw BadRequestError if validation fails', () => {
        const req = mockRequest({ name: 'John', age: 'not-a-number' });
        const res = mockResponse();

        expect(() => validateBody(req, res, mockNext)).toThrow(BadRequestError);
        expect(mockNext).not.toHaveBeenCalled();
    });
});
