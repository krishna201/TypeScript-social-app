import { Router } from 'express';
import auth from '../middlewares/authMiddleware';
import permit from '../middlewares/permissionMiddleware';
import { RoleType } from '../utils/enums';
import { todoController } from '../controllers';

//USER ROUTES//
const _router: Router = Router({
    mergeParams: true,
});

//TODO ADD
_router
    .route('/add')
    .post(
        auth,
        permit([RoleType.ADMIN, RoleType.USER]),
        todoController.addTodo
    );
_router
    .route('/delete')
    .post(
        auth,
        permit([RoleType.ADMIN, RoleType.USER]),
        todoController.deleteTodo
    );
_router
    .route('/list')
    .get(
        auth,
        permit([RoleType.ADMIN, RoleType.USER]),
        todoController.todoList
    );
_router
    .route('/edit')
    .post(
        auth,
        permit([RoleType.ADMIN, RoleType.USER]),
        todoController.updateEdit
    );
_router
    .route('/get/:todoId')
    .get(
        auth,
        permit([RoleType.ADMIN, RoleType.USER]),
        todoController.getById
    );
_router
    .route('updatestatus')
    .post(
        auth,
        permit([RoleType.ADMIN, RoleType.USER]),
        todoController.upateStatusById
    );


//EXPORT
export const router = _router;