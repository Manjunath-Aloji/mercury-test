import mercury from "@mercury-js/core";
import jwt, { SignOptions } from "jsonwebtoken";
import { Context, ImageUploadInput } from "../type";
import { uploadImage } from "../utils/index.ts";
import { Schema } from "mongoose";
import { UserInterface, UserModel } from "../models/users.model.ts";

const customUserTypeDef = `
  type User {
    accessToken: String
  }

  type Mutation {

    signIn(identifier: String!, password: String!): User

    signUp(
        first_name: String!,
        last_name: String,
        phone: String,
        role: String!,
        email: String!,
        user_name: String,
        password: String!,
        address: String,
        profile_photo: ImageUploadInput,
        gender: String!,
    ): User

    signInClass(identifier: String!, password: String!): User

    changePassword(oldPassword: String!, newPassword: String!): String
}

`;

const generateAccessToken = async (id: string | Schema.Types.ObjectId) => {
    return jwt.sign(
        {
            id: id,
        },
        process.env.JWT_ACCESS_TOKEN_SECRET as string,
        {
            expiresIn: process.env
                .JWT_ACCESS_TOKEN_EXPIRY as SignOptions["expiresIn"],
        }
    );
};

const customUserResolvers = {
    Mutation: {
        signIn: async (
            _: any,
            { identifier, password }: { identifier: string; password: string },
            context: Context
        ) => {

            const user : UserInterface | undefined = await mercury.db.User.get(
                { $or: [{ user_name: identifier }, { email: identifier }] },
                { id: "1", profile: "DEFAULT" }
            );

            if (!user || Object.keys(user).length === 0) {
                throw new Error("User not found");
            }
            const isPasswordCorrect = await mercury.db.User.verifyBcryptField(
                user,
                "password",
                password,
                { id: "1", profile: "DEFAULT" }
            );
            if (!isPasswordCorrect) {
                throw new Error("Invalid password");
            }

            const accessTokenFromClass = context.auth.generateToken(user.id);           

            const accessToken = await generateAccessToken(user.id);

            // delete user.password;
            user.accessToken = accessToken;
            return user;
        },

        signUp: async (
            _: any,
            {
                first_name,
                last_name,
                phone,
                role,
                email,
                user_name,
                password,
                address,
                profile_photo,
                school_id,
                gender,
            }: {
                first_name: string;
                last_name: string;
                phone: string;
                role: string;
                email: string;
                user_name: string | undefined;
                password: string;
                address: string;
                profile_photo: ImageUploadInput;
                school_id: string;
                gender: string;
            }
        ) => {
            const existingUser = await mercury.db.User.get(
                { email },
                { id: "1", profile: "DEFAULT" }
            );

            if (existingUser) {
                throw new Error("User with same email already exists.");
            }

            if (profile_photo) {
                await uploadImage(
                    profile_photo.file_name,
                    profile_photo.base64
                ).then((res) => {
                    profile_photo.file_name = res;
                }
                );
            }
            const user = await mercury.db.User.create(
                {
                    first_name,
                    role,
                    email,
                    password,
                    gender,
                    user_name: user_name || email,
                    ...(school_id && { school_id }),
                    ...(profile_photo && {
                        profile_photo: profile_photo.file_name,
                    }),
                    ...(last_name && { last_name }),
                    ...(phone && { phone }),
                    ...(address && { address }),
                },
                { id: "1", profile: "DEFAULT" },
                {
                    select: ["-password"],
                }
            );
            return user;
        },

        changePassword: async (
            _: any,
            {
                oldPassword,
                newPassword,
            }: {
                oldPassword: string;
                newPassword: string;
            },
            context: Context
        ) => {
            if (!oldPassword || !newPassword) {
                throw new Error("Please provide old and new password");
            }

            const contextUser = context.user;

            const user = await mercury.db.User.get(
                { _id: contextUser._id },
                contextUser
            );

            if (!user) {
                throw new Error("User not found");
            }

            const isPasswordCorrect = await mercury.db.User.verifyBcryptField(
                user,
                "password",
                oldPassword,
                contextUser
            );

            if (!isPasswordCorrect) {
                throw new Error("Invalid Old password");
            }

            await mercury.db.User.update(
                contextUser.id,
                { password: newPassword },
                contextUser
            );

            return "Password changed successfully";
        },
    },
};

export { customUserTypeDef, customUserResolvers };
