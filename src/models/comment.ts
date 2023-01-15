import mongoose, { Document, Schema } from 'mongoose';
import { CommentInterface } from '../interfaces';

//EXPORT INTERFACE WITH MONGOOSE DOCUMENT
export interface CommentInterfaceModel extends CommentInterface, Document { }

//DEFINE USER SCHEMA
const CommentSchema: Schema = new Schema(
    {
        comment_title: {
            type: String,
            required: true,
        },
        postId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },


    },
    { timestamps: true }
);

//EXPORT
export default mongoose.model<CommentInterfaceModel>('Comment', CommentSchema);