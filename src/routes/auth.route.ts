import { Router } from 'express';
import validate from '../middlewares/validationMiddleware';
import { authController } from '../controllers';
import { emailAddress, loginPassword } from '../validators/authValidator';

//AUTH ROUTES//
const _router: Router = Router({
    mergeParams: true,
});

//USER LOGIN
_router
    .route('/login')
    .post(validate([emailAddress(), loginPassword()]), authController.login);

//USER FORGOT PASSWORD
_router
    .route('/forgot-password')
    .post(validate([emailAddress()]), authController.forgotPassword);
_router
    .route('/refresh-token')
    .post(validate([emailAddress()]), authController.refreshToken);





//EXPORT
export const router = _router;