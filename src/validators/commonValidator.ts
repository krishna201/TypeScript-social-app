import { body, param, query } from 'express-validator';
import { isEmpty } from 'lodash';



//TEXT FIELD VALIDATOR FUNCTION
const requiredTextField = (
    field: string,
    messageName: string,
    options: { min: number; max: number }
) => {
    return body(field)
        .trim()
        .exists()
        .notEmpty()
        .withMessage(`${messageName} is required`)
        .isString()
        .bail()
        .isLength({
            min: options.min,
            max: options.max,
        })
        .withMessage(
            `${messageName} must be between ${options.min} and ${options.max} characters`
        );
};



//EXPORT
export { requiredTextField };