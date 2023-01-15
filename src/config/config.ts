import dotenv from 'dotenv';

dotenv.config();

const SERVER_PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
//==============
const MONGO_URL = 'mongodb+srv://admin:admin@cluster0.mbgq7ek.mongodb.net/?retryWrites=true&w=majority';
// const MONGO_URL = 'mongodb://127.0.0.1/socialapp';
//CREATE CONFIG OBJECT
const config = {
    mongo: {
        url: MONGO_URL,
    },
    server: {
        port: SERVER_PORT,
    },
};

//CHECK FOR ENVIRONMENT

config.mongo.url = MONGO_URL;
config.server.port = SERVER_PORT;

//EXPORT
export default config;