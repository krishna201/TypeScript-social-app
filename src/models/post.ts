import mongoose, { Document, Schema } from 'mongoose';
import { PostInterface } from '../interfaces';

//EXPORT INTERFACE WITH MONGOOSE DOCUMENT
export interface PostInterfaceModel extends PostInterface, Document { }

//DEFINE POST SCHEMA
const PostSchema: Schema = new Schema(
    {
        post_title: {
            type: String,
            required: true,
        },
        post_desc: {
            type: String,
            required: false,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },


    },
    { timestamps: true }
);

//EXPORT
export default mongoose.model<PostInterfaceModel>('Post', PostSchema);