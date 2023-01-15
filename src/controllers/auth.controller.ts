import { NextFunction, Request, Response } from 'express';
import HttpError from '../utils/httpError';
import { jsonOne } from '../utils/general';
import { matchedData } from 'express-validator';
import User, { IUserModel } from '../models/user';
import { generateJWT } from '../utils/index';
import { compare, hash } from 'bcrypt';
import { AuthInterface } from '../interfaces/authInterface';

//GENERATE TOKEN FOR LOGIN
const tokenBuilder = async (user: IUserModel) => {
    const accessToken = generateJWT(
        {
            id: user._id,
            role: user.role?.name,
            tokenType: 'access',
        },
        {
            issuer: user.email,
            subject: user.email,
            audience: 'root',
        }
    );

    return {
        accessToken: accessToken,
    };
};

//USER LOGIN
const login = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<AuthInterface> => {
    try {
        let bodyData = matchedData(req, {
            includeOptionals: true,
            locations: ['body'],
        });

        const { email, password } = bodyData;

        let user = await User.findOne({ email }).populate('role');

        const isValidPass = await compare(password, user.password);
        //CHECK FOR USER VERIFIED AND EXISTING
        if (!user || !isValidPass) {
            throw new HttpError({
                title: 'bad_login',
                detail: 'You have entered an invalid email address or password',
                code: 400,
            });
        }
        //CREATE TOKEN
        const token = await tokenBuilder(user);
        const response = {
            user,
            accessToken: token.accessToken,
        };
        return jsonOne<AuthInterface>(res, 200, response);
    } catch (error) {
        next(error);
    }
};

//USER GORGOT PASSWORD
const forgotPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const email = req.body.email;
        const user = await User.findOne({ email }).populate('role');

        //CHECK FOR USER VERIFIED AND EXISTING
        if (!user.isEmailVerified) {
            throw new HttpError({
                title: 'bad_request',
                detail: 'Please confirm your account by confirmation email OTP and try again',
                code: 400,
            });
        } else if (!user) {
            throw new HttpError({
                title: 'bad_login',
                detail: 'You have entered an invalid email address or password',
                code: 400,
            });
        }

        let tokenExpiration: any = new Date();
        tokenExpiration = tokenExpiration.setMinutes(
            tokenExpiration.getMinutes() + 10
        );




        //SEND FORGOT PASSWORD EMAIL


        return jsonOne<string>(
            res,
            200,
            'Forget Password OTP sent successfully'
        );
    } catch (e) {
        next(e);
    }
};
const refreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email } = req.body;

        let user = await User.findOne({ email }).populate('role');


        //refresh TOKEN
        const token = await tokenBuilder(user);
        const response = {
            user,
            accessToken: token.accessToken,
        };
        return jsonOne<AuthInterface>(res, 200, response);
    } catch (e) {
        next(e);
    }
};



//RESET PASSWORD


//EXPORT
export default {
    login,
    forgotPassword,
    refreshToken
};