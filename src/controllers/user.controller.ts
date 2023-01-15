import { NextFunction, Request, Response } from 'express';
import HttpError from '../utils/httpError';
import { jsonOne, jsonAll } from '../utils/general';
import { RoleType } from '../utils/enums';
import User, { IUserModel } from '../models/user';
import Role from '../models/role';
import { hash } from 'bcrypt';
import { IUser } from '../interfaces';
import { checkPermission } from '../utils';

const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { firstName, lastName, avatar, email, password } = req.body;
        const userExist = await User.exists({ email });
        if (userExist) {
            throw new HttpError({
                title: 'emailAddress',
                detail: 'Email address is already used',
                code: 422,
            });
        }
        const role = await Role.findOne({ name: RoleType.USER });
        if (!role) {
            throw new HttpError({
                title: 'role',
                detail: 'User role not found',
                code: 422,
            });
        }
        const hashPassword = await hash(password, 12);
        let user = new User({
            firstName,
            lastName,
            avatar,
            email,
            password: hashPassword,
            role: role._id,
        });
        let savedUser = await user.save();

        //GENERATE OTP FOR MAIL VERIFICATION
        let tokenExpiration: any = new Date();
        tokenExpiration = tokenExpiration.setMinutes(
            tokenExpiration.getMinutes() + 10
        );

        return jsonOne<IUserModel>(res, 201, savedUser);
    } catch (error) {
        next(error);
    }
};



const getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.userId;

        let data = await User.findById(userId).populate('role');

        return jsonOne<IUser>(res, 200, data);
    } catch (error) {
        next(error);
    }
};

const getAllUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let pageOptions: { page: number; limit: number } = {
            page: Number(req.query.page) || 1,
            limit: Number(req.query.limit) || 10,
        };

        const count = await User.countDocuments({});
        let users = await User.find()
            .populate('role')
            .limit(pageOptions.limit * 1)
            .skip((pageOptions.page - 1) * pageOptions.limit)
            .sort({ createdAt: -1 });
        //CREATE PAGINATION
        const meta = {
            total: count,
            limit: pageOptions.limit,
            totalPages: Math.ceil(count / pageOptions.limit),
            currentPage: pageOptions.page,
        };
        return jsonAll<any>(res, 200, users, meta);
    } catch (error) {
        next(error);
    }
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = req.body;
        const payload = req['tokenPayload'];
        const userId = payload['id'];

        /** Check if user is trying to update another user data */
        const isPermission = await checkPermission(User, req, userId, '_id');
        if (!isPermission) {
            throw new HttpError({
                title: 'forbidden',
                detail: 'Access Forbidden',
                code: 403,
            });
        }

        let user = await User.findById(userId);
        //If User not found
        if (!user) {
            throw new HttpError({
                title: 'bad_request',
                detail: 'User Not Found.',
                code: 400,
            });
        }

        let savedUser = await User.findOneAndUpdate(
            { _id: userId },
            {
                firstName: body.firstName,
                lastName: body.lastName,
                gender: body.gender,
                email: body.email
            },
            { new: true }
        );
        return jsonOne<IUserModel>(res, 200, savedUser);
    } catch (error) {
        next(error);
    }
};

//EXPORT
export default {
    createUser,
    getUser,
    getAllUser,
    updateUser,
};
