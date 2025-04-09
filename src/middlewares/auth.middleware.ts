import { IncomingMessage, ServerResponse } from "http";
import { EXCLUDE_JWT_VERIFICATION } from "../utils/constants.ts";
import mercury from "@mercury-js/core";
import jwt, { SignOptions } from "jsonwebtoken";
import { UserInterface } from "../models/users.model.ts";
import { Types } from "mongoose";

interface ExtendedIncomingMessage extends IncomingMessage {
    body?: any;
}

const verifyJwt = async ({
    req,
    res,
}: {
    req: ExtendedIncomingMessage;
    res: ServerResponse;
}) => {
    // if (!req.body?.operationName) return { user: { id: "1", profile: "DEFAULT" } };

    if (
        req.body?.operationName &&
        EXCLUDE_JWT_VERIFICATION.includes(req.body.operationName)
    )
        return { user: { id: "1", profile: "DEFAULT" } };

    const accessToken = req.headers.authorization;

    if (!accessToken) throw new Error("Unauthorized access");

    const decodedToken = jwt.verify(
        accessToken,
        process.env.JWT_ACCESS_TOKEN_SECRET as string
    );

    if (!decodedToken) throw new Error("Invalid access token");

    if (!decodedToken || typeof decodedToken !== "object")
        throw new Error("Invalid access token");

    const user: UserInterface | undefined = await mercury.db.User.get(
        {
            _id: decodedToken.id,
        },
        { id: "1", profile: "DEFAULT" }
    );

    if (!user) throw new Error("Invalid access token");

    return { user };
};

export default verifyJwt;

export class Auth {
    private req: ExtendedIncomingMessage;
    private res: ServerResponse;

    constructor(req: ExtendedIncomingMessage, res: ServerResponse) {
        this.req = req;
        this.res = res;
    }

    static isVerificationExcluded(req: ExtendedIncomingMessage) {
        if (
            req.body?.operationName &&
            EXCLUDE_JWT_VERIFICATION.includes(req.body.operationName)
        )
            return true;
        return false;
    }

    public async verifyJwt() {
        if (Auth.isVerificationExcluded(this.req)) {
            return { user: { id: "1", profile: "DEFAULT" } };
        }
        const accessToken = this.req.headers.authorization;
        if (!accessToken) throw new Error("Unauthorized access");

        const decodedToken = jwt.verify(
            accessToken,
            process.env.JWT_ACCESS_TOKEN_SECRET as string
        );

        if (!decodedToken) throw new Error("Invalid access token");

        if (!decodedToken || typeof decodedToken !== "object")
            throw new Error("Invalid access token");

        const user: UserInterface | undefined = await mercury.db.User.get(
            {
                _id: decodedToken.id,
            },
            { id: "1", profile: "DEFAULT" }
        );

        if (!user) throw new Error("Invalid access token");

        user.profile = user.role

        return { user };
    }

    public async generateToken(user_id: string | Types.ObjectId) {
        const accessToken = jwt.sign(
            { id: user_id },
            process.env.JWT_ACCESS_TOKEN_SECRET as string,
            {
                expiresIn: process.env
                    .JWT_ACCESS_TOKEN_EXPIRY as SignOptions["expiresIn"],
            }
        );

        return accessToken;
    }
}

export const setContext = async ({
    req,
    res,
}: {
    req: ExtendedIncomingMessage;
    res: ServerResponse;
}) => {
    const auth = new Auth(req, res);
    const user = await auth.verifyJwt();
    
    return { ...user, auth };
};
