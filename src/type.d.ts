import { CtxUser } from "@mercury-js/core/dist/esm/types";
import { UserInterface } from "./models/users.model.ts";

import { BaseContext } from "@apollo/server";
import { Auth } from "./middlewares/auth.middleware.ts";

interface Context extends BaseContext {
    user : UserInterface
    auth: Auth
}

interface ImageUploadInput {
    file_name: string
    base64: string
}