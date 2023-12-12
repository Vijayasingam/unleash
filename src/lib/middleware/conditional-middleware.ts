import { RequestHandler, Router } from 'express';

export const conditionalMiddleware = (
    condition: () => boolean,
    middleware: RequestHandler,
): RequestHandler => {
    const router = Router();

    router.use((req, res, next) => {
        res.setHeader('Vary', 'Origin');
        if (condition()) {
            middleware(req, res, next);
        } else {
            next();
        }
    });

    return router;
};
