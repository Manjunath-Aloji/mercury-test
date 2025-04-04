import { IncomingMessage, ServerResponse } from "http";
import { EXCLUDE_JWT_VERIFICATION } from "../utils/constants.ts";
import mercury from "@mercury-js/core";
import jwt from "jsonwebtoken";

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
    console.log(req.body?.operationName);
    
    if (!req.body?.operationName) return { user: { id: "1", profile: "DEFAULT" } };

    console.log("operationName", req.body?.operationName);
    
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

    const user = await mercury.db.User.get(
        {
            _id: decodedToken.id,
        },
        { id: "1", profile: "DEFAULT" }
    );

    user.profile = user.role;

    return { user };
};

export default verifyJwt;
