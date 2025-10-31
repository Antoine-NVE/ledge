import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { BadRequestError } from '../../../../../infrastructure/errors/bad-request-error';
import { validateParams } from '../../../../../presentation/shared/middlewares/validate-params/validate-params-middleware';

describe('ValidateParamsMiddleware', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: NextFunction;

    beforeEach(() => {
        mockRequest = {
            params: {},
        };
        mockResponse = {};
        nextFunction = jest.fn();
    });

    it('should call next() when validation succeeds', () => {
        const schema = z.object({
            id: z.string(),
        });
        mockRequest.params = { id: '123' };

        const middleware = validateParams(schema);
        middleware(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction,
        );

        expect(nextFunction).toHaveBeenCalled();
    });

    it('should throw BadRequestError when validation fails', () => {
        const schema = z.object({
            id: z.number(),
        });
        mockRequest.params = { id: 'not-a-number' };

        const middleware = validateParams(schema);

        expect(() => {
            middleware(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction,
            );
        }).toThrow(BadRequestError);
    });

    it('should throw BadRequestError with correct message when required field is missing', () => {
        const schema = z.object({
            id: z.string(),
        });
        mockRequest.params = {};

        const middleware = validateParams(schema);

        expect(() => {
            middleware(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction,
            );
        }).toThrow('Invalid parameters');
    });
});
