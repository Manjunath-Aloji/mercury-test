import mercury from "@mercury-js/core";
import jwt, { SignOptions } from "jsonwebtoken";
import { Context } from "../type";

const customUserTypeDef = `
  type User {
    accessToken: String
  }

  type Mutation {

    signIn(identifier: String!, password: String!): User

    signUp(
        first_name: String!,
        last_name: String!,
        phone: String!,
        role: String!,
        email: String!,
        user_name: String,
        password: String!
        address: String!
    ): User

    changePassword(oldPassword: String!, newPassword: String!): String
}

`;

const generateAccessToken = async (id: string) => {
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
            { identifier, password }: { identifier: string; password: string }
        ) => {

            const user = await mercury.db.User.get(
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

            const accessToken = await generateAccessToken(user._id);

            delete user.password;
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
            }: {
                first_name: string;
                last_name: string;
                phone: string;
                role: string;
                email: string;
                user_name: string | undefined;
                password: string;
                address: string;
            }
        ) => {
            const existingUser = await mercury.db.User.get(
                { email },
                { id: "1", profile: "DEFAULT" }
            );

            if (Object.keys(existingUser).length > 0) {
                throw new Error("User with same email already exists.");
            }
            const user = await mercury.db.User.create(
                {
                    first_name,
                    last_name,
                    phone,
                    role,
                    email,
                    password,
                    user_name: user_name || email,
                    address,
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
                { id: contextUser.id, profile: contextUser.role }
            );

            if (!user) {
                throw new Error("User not found");
            }

            const isPasswordCorrect = await mercury.db.User.verifyBcryptField(
                user,
                "password",
                oldPassword,
                { id: contextUser.id, profile: contextUser.role }
            );

            if (!isPasswordCorrect) {
                throw new Error("Invalid Old password");
            }

            await mercury.db.User.update(
                contextUser.id,
                { password: newPassword },
                { id: contextUser.id, profile: contextUser.role }
            );

            return "Password changed successfully";
        },
    },
};

export { customUserTypeDef, customUserResolvers };
