import { NextFunction, Request, Response } from 'express';
import HttpError from '../utils/httpError';
import { jsonOne, jsonAll } from '../utils/general';
import Todo, { TodoInterfaceModel } from '../models/todo';
import { checkPermission } from '../utils';


const addTodo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title } = req.body;
        const payload = req['tokenPayload'];

        let todo = new Todo({
            title,
            userId: payload.id
        });
        let savedTodo = await todo.save();




        return jsonOne<TodoInterfaceModel>(res, 201, savedTodo);
    } catch (error) {
        next(error);
    }
};
const deleteTodo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { todoId } = req.body;
        const isPermission = await checkPermission(Todo, req, todoId, 'userId');
        if (!isPermission) {
            throw new HttpError({
                title: 'forbidden',
                detail: 'Access Forbidden',
                code: 403,
            });
        }
        let deleteTodo: any = await Todo.deleteOne({ "_id": todoId });

        return jsonOne<TodoInterfaceModel>(res, 201, deleteTodo);
    } catch (error) {
        next(error);
    }
};

const todoList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let pageOptions: { page: number; limit: number } = {
            page: Number(req.query.page) || 1,
            limit: Number(req.query.limit) || 10,
        };
        const count = await Todo.countDocuments({});
        let todoList: any = await Todo.find()
            .populate({
                path: "userId",
                populate: { path: "role" },
            })
            .limit(pageOptions.limit * 1)
            .skip((pageOptions.page - 1) * pageOptions.limit)
            .sort({ createdAt: -1 });
        const meta = {
            total: count,
            limit: pageOptions.limit,
            totalPages: Math.ceil(count / pageOptions.limit),
            currentPage: pageOptions.page,
        };
        return jsonAll<any>(res, 201, todoList, meta);
    } catch (error) {
        next(error);
    }
};

const updateEdit = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { todoId, title } = req.body;
        const isPermission = await checkPermission(Todo, req, todoId, 'userId');
        if (!isPermission) {
            throw new HttpError({
                title: 'forbidden',
                detail: 'Access Forbidden',
                code: 403,
            });
        }
        let updateTodo = await Todo.findOneAndUpdate(
            { _id: todoId },
            {
                title: title
            },
            { new: true }
        );

        return jsonOne<TodoInterfaceModel>(res, 201, updateTodo);
    } catch (error) {
        next(error);
    }
};

const getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(req.params, req.query)
        const { todoId, title } = req.params;
        //FIND EXIST USES

        //CRETA NEW USRE
        let todoData: any = await Todo.findOne({ _id: todoId });

        return jsonOne<TodoInterfaceModel>(res, 201, todoData);
    } catch (error) {
        next(error);
    }
};

const upateStatusById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { todoId, title } = req.body;
        const isPermission = await checkPermission(Todo, req, todoId, 'userId');
        if (!isPermission) {
            throw new HttpError({
                title: 'forbidden',
                detail: 'Access Forbidden',
                code: 403,
            });
        }
        let updateTodo = await Todo.findOneAndUpdate(
            { _id: todoId },
            {
                isCompleted: true
            },
            { new: true }
        );

        return jsonOne<TodoInterfaceModel>(res, 201, updateTodo);
    } catch (error) {
        next(error);
    }
};







//EXPORT
export default {
    addTodo,
    deleteTodo,
    todoList,
    getById,
    updateEdit,
    upateStatusById
};
