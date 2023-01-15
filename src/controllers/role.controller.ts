import { NextFunction, Request, Response } from 'express';
import { jsonAll } from '../utils/general';
import Role from '../models/role';
import { RoleType } from '../utils/enums';
import User from '../models/user';
import HttpError from '../utils/httpError';
import { hash } from 'bcrypt';


//CREATE AUTOMATIC ROLE AT FIRST WHEN WE CREATE NEW DB
export function crateRole() {
    Role.estimatedDocumentCount((err: any, count: number) => {
        if (!err && count === 0) {
            new Role({
                name: 'user',
            }).save((err) => {
                if (err) {
                    console.log('error', err);
                }
                console.log("added 'user' to roles collection");
            });

            new Role({
                name: 'admin',
            }).save((err, data) => {
                if (err) {
                    console.log('error', err);
                }
                // crateSuperAdminRole()
                console.log("added 'admin' to roles collection");
            });
        }
    });
}
export async function crateSuperAdminRole() {
    try {
        const serperAdminExist = await User.findOne({ email: "superadmin@gmail.com" });
        if (serperAdminExist) {
            console.log(
                'super admin credentail-(email: superadmin@gmail.com password:admin)')
        }
        const hashPassword = await hash('admin', 12);
        const role = await Role.findOne({ name: RoleType.ADMIN });
        let user = new User({
            firstName: 'Super',
            lastName: 'Admin',
            email: "superadmin@gmail.com",
            password: hashPassword,
            role: role._id,
        });
        await user.save();
        console.log(
            'super admin credentail-(email: superadmin@gmail.com password:admin)')

    } catch (error) {
        console.error(error)
    }
}

//GET ROLES LIST
const getAllRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let pageOptions: { page: number; limit: number } = {
            page: Number(req.query.page) || 1,
            limit: Number(req.query.limit) || 10,
        };
        const count = await Role.countDocuments({});
        //GETING DATA FROM TABLE
        const roles = await Role.find()
            .limit(pageOptions.limit * 1)
            .skip((pageOptions.page - 1) * pageOptions.limit)
            .sort({ createdAt: -1 });
        //CREATE RESPONSE
        const result = {
            roles,
        };
        //CREATE PAGINATION
        const meta = {
            total: count,
            limit: pageOptions.limit,
            totalPages: Math.ceil(count / pageOptions.limit),
            currentPage: pageOptions.page,
        };
        //SEND RESPONSE
        return jsonAll(res, 201, result, meta);
    } catch (error) {
        next(error);
    }
};

//EXPORT
export default {
    getAllRole,
};
