import mongoose, { Document, Schema } from 'mongoose';
import { TodoInterface } from '../interfaces';

//EXPORT INTERFACE WITH MONGOOSE DOCUMENT
export interface TodoInterfaceModel extends TodoInterface, Document { }

//DEFINE TODO SCHEMA
const TodoSchema: Schema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        isCompleted: {
            type: Boolean,
            default: false
        }


    },
    { timestamps: true }
);

//EXPORT
export default mongoose.model<TodoInterfaceModel>('Todo', TodoSchema);