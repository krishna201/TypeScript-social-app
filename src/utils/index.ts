import * as jwt from 'jsonwebtoken';
import HttpError from './httpError';
import { RoleType } from '../utils/enums';


const generateJWT = function (
    payload: object = {},
    options: object = {}
): string {
    const privateKey: any = process.env.JWT_SECRETS;
    const defaultOptions: object = {
        expiresIn: '1h',
    };

    return jwt.sign(
        payload,
        privateKey,
        Object.assign(defaultOptions, options)
    );
};




//VALIDATE ACCESS/REFRESH TOKEN
const validateToken = function (token: string): Object {
    try {
        const publicKey: any = process.env.JWT_SECRETS;
        const letdata = jwt.verify(token, publicKey);
        console.log("letdata", letdata)
        return letdata
    } catch (e) {
        throw new HttpError({
            title: 'invalid_token',
            detail: 'Invalid token',
            code: 400,
        });
    }
};



//USED TO GENERATE JWT WITH PAYLOAD AND OPTIONS AS PARAMETERS.
const extractToken = function (token: string): string | null {
    if (token?.startsWith('Bearer ')) {
        return token.slice(7, token.length);
    }
    return null;
};





const checkPermission = async function (
    db: any,
    req: any,
    id: object = {},
    existKey: any
) {

    const payload = req['tokenPayload'];
    const userId = payload['id'];
    let todoDoc = await db.findOne({ _id: id });
    if (userId !== todoDoc[existKey] && [RoleType.USER].includes(payload['role'])) {
        return false
    }
    return true
};




//EXPORT
export {
    generateJWT,
    validateToken,
    extractToken,
    checkPermission
};