import { Router } from 'express';
import auth from '../middlewares/authMiddleware';
import permit from '../middlewares/permissionMiddleware';
import { RoleType } from '../utils/enums';
import { postController } from '../controllers';

//USER ROUTES//
const _router: Router = Router({
    mergeParams: true,
});

//TODO ADD
_router
    .route('/add')
    .post(
        auth,
        postController.createPost
    );
_router
    .route('/delete')
    .post(
        auth,
        permit([RoleType.ADMIN, RoleType.USER]),
        postController.deletePost
    );
_router
    .route('/list')
    .get(
        auth,
        permit([RoleType.ADMIN, RoleType.USER]),
        postController.postList
    );
_router
    .route('/edit')
    .post(
        auth,
        permit([RoleType.ADMIN, RoleType.USER]),
        postController.updatePost
    );
_router
    .route('/get/:todoId')
    .get(
        auth,
        permit([RoleType.ADMIN, RoleType.USER]),
        postController.getPostById
    );


//EXPORT
export const router = _router;