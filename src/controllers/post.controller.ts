import { NextFunction, Request, Response } from 'express';
import HttpError from '../utils/httpError';
import { jsonOne, jsonAll } from '../utils/general';
import { checkPermission } from '../utils';
import Post, { PostInterfaceModel } from '../models/post';

const createPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { post_title, post_desc } = req.body;
        const payload = req['tokenPayload'];


        let post = new Post({
            post_title,
            post_desc,
            userId: payload.id
        });
        let savedPost = await post.save();




        return jsonOne<PostInterfaceModel>(res, 201, savedPost);
    } catch (error) {
        next(error);
    }
};
const deletePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { postId } = req.body;
        let deletePost: any = await Post.deleteOne({ "_id": postId });
        const isPermission = await checkPermission(Comment, req, postId, 'userId');
        if (!isPermission) {
            throw new HttpError({
                title: 'forbidden',
                detail: 'Access Forbidden',
                code: 403,
            });
        }


        return jsonOne<PostInterfaceModel>(res, 201, deletePost);
    } catch (error) {
        next(error);
    }
};

const postList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let pageOptions: { page: number; limit: number } = {
            page: Number(req.query.page) || 1,
            limit: Number(req.query.limit) || 10,
        };
        const count = await Post.countDocuments({});
        let postList: any = await Post.find()
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

        return jsonAll<any>(res, 201, postList, meta);
    } catch (error) {
        next(error);
    }
};

const updatePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { postId, post_title,
            post_desc, } = req.body;
        const isPermission = await checkPermission(Comment, req, postId, 'userId');
        if (!isPermission) {
            throw new HttpError({
                title: 'forbidden',
                detail: 'Access Forbidden',
                code: 403,
            });
        }
        let updatePost = await Post.findOneAndUpdate(
            { _id: postId },
            {
                post_title,
                post_desc,
            },
            { new: true }
        );

        return jsonOne<PostInterfaceModel>(res, 201, updatePost);
    } catch (error) {
        next(error);
    }
};

const getPostById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(req.params, req.query)
        const { postId, } = req.params;

        let postData: any = await Post.findOne({ _id: postId });

        return jsonOne<PostInterfaceModel>(res, 201, postData);
    } catch (error) {
        next(error);
    }
};





//EXPORT
export default {
    createPost,
    postList,
    deletePost,
    updatePost,
    getPostById,

};
