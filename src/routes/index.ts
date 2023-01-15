import { NextFunction, Request, Response, Router } from 'express';
import { router as AuthRouter } from './auth.route';
import { router as UserRouter } from './user.route';
import { router as TodoRouter } from './todo.route';
import { router as Role } from './role.route';
import { router as CommentRouter } from './comment.route';

const _router: Router = Router({
    mergeParams: true,
});

//DEFINE API VERSION
_router.use(function (req: Request, res: Response, next: NextFunction) {
    res.setHeader('Api-Version', 'v1');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    next();
});



//EXPORT ROUTES WITH BASEPATH
_router.use('/v1/role', Role);
_router.use('/v1/user', UserRouter);
_router.use('/v1/auth', AuthRouter);
_router.use('/v1/todo', TodoRouter);
_router.use('/v1/comment', CommentRouter);


export const router = _router;