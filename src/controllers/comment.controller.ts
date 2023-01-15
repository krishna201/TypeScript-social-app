import { NextFunction, Request, Response } from 'express';
import HttpError from '../utils/httpError';
import { jsonOne, jsonAll } from '../utils/general';
import Comment, { CommentInterfaceModel } from '../models/comment';
import { checkPermission } from '../utils';

const addComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { comment_title, postId } = req.body;
        const payload = req['tokenPayload'];


        //CRETA NEW COMMENT
        let comment = new Comment({
            comment_title,
            postId,
            userId: payload.id
        });
        let savedPost = await comment.save();



        return jsonOne<CommentInterfaceModel>(res, 201, savedPost);
    } catch (error) {
        next(error);
    }
};
const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { commentId } = req.body;
        const isPermission = await checkPermission(Comment, req, commentId, 'userId');
        if (!isPermission) {
            throw new HttpError({
                title: 'forbidden',
                detail: 'Access Forbidden',
                code: 403,
            });
        }
        let deleteComment: any = await Comment.deleteOne({ "_id": commentId });



        return jsonOne<CommentInterfaceModel>(res, 201, deleteComment);
    } catch (error) {
        next(error);
    }
};

const commentList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let pageOptions: { page: number; limit: number } = {
            page: Number(req.query.page) || 1,
            limit: Number(req.query.limit) || 10,
        };
        const count = await Comment.countDocuments({});

        let commentList: any = await Comment.find()
            .populate('post')
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

        return jsonAll<any>(res, 201, commentList, meta);
    } catch (error) {
        next(error);
    }
};

const updateComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { commentId, comment_title } = req.body;
        const isPermission = await checkPermission(Comment, req, commentId, 'userId');
        if (!isPermission) {
            throw new HttpError({
                title: 'forbidden',
                detail: 'Access Forbidden',
                code: 403,
            });
        }
        let updateComment = await Comment.findOneAndUpdate(
            { _id: commentId },
            {
                comment_title: comment_title
            },
            { new: true }
        );

        return jsonOne<CommentInterfaceModel>(res, 201, updateComment);
    } catch (error) {
        next(error);
    }
};

const getCommentById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(req.params, req.query)
        const { commentId } = req.params;
        let postData: any = await Comment.findOne({ _id: commentId });

        return jsonOne<CommentInterfaceModel>(res, 201, postData);
    } catch (error) {
        next(error);
    }
};

const getCommentByPostId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(req.params, req.query)
        const { postId } = req.params;
        let pageOptions: { page: number; limit: number } = {
            page: Number(req.query.page) || 1,
            limit: Number(req.query.limit) || 10,
        };
        const count = await Comment.countDocuments({ postId: postId });

        let commentData: any = await Comment.find({ postId: postId })
            .populate('post')
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

        return jsonAll<any>(res, 201, commentData, meta);
    } catch (error) {
        next(error);
    }
};




//EXPORT
export default {
    addComment,
    deleteComment,
    commentList,
    updateComment,
    getCommentById,
    getCommentByPostId
};
