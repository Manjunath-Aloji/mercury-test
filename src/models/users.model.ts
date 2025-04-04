import mercury from "@mercury-js/core";
import { Model, Schema } from "mongoose";

export interface UserInterface {
    _id: Schema.Types.ObjectId;
    first_name: string;
    last_name: string;
    phone: string;
    role: string;
    user_name: string;
    email: string;
    id: string;
}

export type UserModel = Model<UserInterface>;

export const User = mercury.createModel<UserModel>(
    "User",
    {
        first_name: { type: "string", required: true, lowercase: true },
        last_name: { type: "string", lowercase: true },
        email: {
            type: "string",
            required: true,
            unique: true,
            lowercase: true,
            index : true,
            validate: {
                validator: function (v: string) {
                    return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
                        v
                    );
                },
                message: (props: any) =>
                    `${props.value} is not a Valid Email, Please Enter a Valid Email!!`,
            },
        },
        user_name: {
            type: "string",
            required: true,
            unique: true,
            lowercase: true,
            index : true,
        },
        phone: { type: "string"},
        role: {
            type: "enum",
            enumType: "string",
            enum: [
                "STAFF",
                "ADMIN",
                "SUPER_ADMIN",
                "STUDENT",
                "PARENT",
                "GATE_KEEPER",
            ],
            required: true,
            default: "STUDENT",
        },
        password: { type: "string", required: true },
        photo: { type: "string" },
        address: { type: "string" },
    },
    {
        historyTracking: true,
        timestamps: true,  
    },
);
