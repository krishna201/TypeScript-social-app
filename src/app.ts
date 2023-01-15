import express from 'express';
import HttpError from './utils/httpError';
import mongoose from 'mongoose';
import config from './config/config';
import { crateRole } from './controllers/role.controller';
import { router as v1 } from './routes/index';
//CONNECTION TO MONGOOSE DATABASE
mongoose.set('strictQuery', false)
mongoose
    .connect(config.mongo.url, { retryWrites: true, w: 'majority', })
    .then(() => {
        crateRole();
        console.log('Connected to mongoDB.');
    })
    .catch((error) => {
        console.error('Unable to connect.');
        console.error(error);
    });
const router = express();
const port = 3000;



router.use(express.urlencoded({ extended: true }));
router.use(express.json());

//RULES OF OUR APIS
router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin,X-Requested-with,Content-Type,Accept,Authorization'
    );

    if (req.method == 'OPTIONS') {
        res.header(
            'Access-Control-Allow-Methods',
            'PUT,POST,PATCH,DELETE,GET'
        );
        return res.status(200).json({});
    }
    next();
});

//API ROUTES WITH VERSION
router.use('/api', v1);
router.get('/', (req, res) => {
    res.send('Hello World!');
});

//HANDEL ALL ERROR THROW BY CONTROLLERS
router.use(function (err: any, req: any, res: any, next: any) {
    console.error(err.stack);

    if (err instanceof HttpError) {
        return err.sendError(res);
    } else {
        console.log(err)
        return res.status(500).json({
            error: {
                title: 'general_error',
                detail: 'An error occurred, Please retry again later',
                code: 500,
            },
        });
    }
});

router.listen(config.server.port, () => {
    return console.log(`Express is listening at http://localhost:${config.server.port}`);
});