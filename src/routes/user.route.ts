import { Router } from 'express';
import { authorization, emailAddress } from '../validators/authValidator';
import validate from '../middlewares/validationMiddleware';
import auth from '../middlewares/authMiddleware';
import permit from '../middlewares/permissionMiddleware';
import { password } from '../validators/userValidator';
import { requiredTextField } from '../validators/commonValidator';
import { RoleType } from '../utils/enums';
import { userController } from '../controllers';

const _router: Router = Router({
    mergeParams: true,
});

_router
    .route('/sign-up')
    .post(
        validate([
            emailAddress(),
            password('password'),
            password('confirmPassword'),
        ]),
        userController.createUser
    );


_router.route('/update/:userId').patch(
    validate([
        authorization(),
        requiredTextField('firstName', 'FirstName', { min: 2, max: 255 }),
        requiredTextField('lastName', 'LastName', { min: 2, max: 255 }),
        requiredTextField('dateOfBirth', 'Date Of Birth', {
            min: 2,
            max: 255,
        }),
        requiredTextField('residence', 'Residence', { min: 2, max: 255 }),
        requiredTextField('avatar', 'Avatar', { min: 2, max: 255 }),
    ]),
    auth,
    permit([RoleType.ADMIN, RoleType.USER]),
    userController.updateUser
);

_router
    .route('/get/:userId')
    .get(
        validate([authorization()]),
        auth,
        permit([RoleType.ADMIN, RoleType.USER]),
        userController.getUser
    );

_router
    .route('/list')
    .get(
        validate([authorization()]),
        auth,
        permit([RoleType.ADMIN, RoleType.USER]),
        userController.getAllUser
    );

//EXPORT
export const router = _router;