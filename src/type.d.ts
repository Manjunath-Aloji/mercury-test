import { CtxUser } from "@mercury-js/core/dist/esm/types";
import { UserInterface } from "./models/users.model.ts";

import { BaseContext } from "@apollo/server";

interface Context extends BaseContext {
    user : UserInterface
}