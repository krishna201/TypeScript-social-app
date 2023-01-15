import { Router } from 'express';
import auth from '../middlewares/authMiddleware';
import permit from '../middlewares/permissionMiddleware';
import { RoleType } from '../utils/enums';
import { commentController } from '../controllers';

//USER ROUTES//
const _router: Router = Router({
    mergeParams: true,
});

//TODO ADD
_router
    .route('/add')
    .post(

        auth,

        commentController.addComment
    );
_router
    .route('/delete')
    .post(

        auth,
        permit([RoleType.ADMIN, RoleType.USER]),
        commentController.deleteComment
    );
_router
    .route('/list')
    .get(
        auth,
        permit([RoleType.ADMIN, RoleType.USER]),
        commentController.commentList
    );
_router
    .route('/edit')
    .post(

        auth,
        permit([RoleType.ADMIN, RoleType.USER]),
        commentController.updateComment
    );
_router
    .route('/get/:commentId')
    .get(

        auth,
        permit([RoleType.ADMIN, RoleType.USER]),
        commentController.getCommentById
    );
_router
    .route('/get/:postId')
    .get(
        auth,
        permit([RoleType.ADMIN, RoleType.USER]),
        commentController.getCommentByPostId
    );


//EXPORT
export const router = _router;