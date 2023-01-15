import { Request, Response, NextFunction } from 'express';
import { validateToken } from '../utils';
import HttpError from '../utils/httpError';
import User from '../models/user';

const auth = async function (req: Request, res: Response, next: NextFunction) {
    try {
        console.log("req.header", req.headers)
        const token = req.headers.authorization;
        const payload = validateToken(token);
        const userId = payload['id'];
        let userDetail = await User.findById(userId)
        if (payload['tokenType'] !== 'access') {
            throw new HttpError({
                title: 'unauthorized',
                detail: 'Invalid Authorization header',
                code: 401,
            });
        }
        req['tokenPayload'] = { ...payload, ...userDetail };
        next();
    } catch (e) {
        if (e.opts?.title === 'invalid_token') {
            next(
                new HttpError({
                    title: 'unauthorized',
                    detail: 'Invalid Authorization header',
                    code: 401,
                })
            );
        } else {
            next(e);
        }
    }
};

export default auth;