import mercury from "@mercury-js/core";
import { Model, Schema } from "mongoose";

export interface PostsInterface {
    _id: Schema.Types.ObjectId;
    title: string;
    content: string;
}

export type UserModel = Model<PostsInterface>;

export const User = mercury.createModel<UserModel>(
    "User",
    {
        title: { type: "string", required: true, lowercase: true },
        content: { type: "string", lowercase: true },
    },
    {
        historyTracking: true,
        timestamps: true,  
    },
);
