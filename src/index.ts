import dotenv from "dotenv";

dotenv.config({
    path: "./.env",
});

import connectDb from "./database/db.connection.ts";
import { startStandaloneServer } from "@apollo/server/standalone";

import server from "./app.ts";
import verifyJwt, { setContext } from "./middlewares/auth.middleware.ts";

connectDb()
    .then(async () => {
        // app.listen(3000, () => console.log("Server is running on port 3000"))3
        const { url } = await startStandaloneServer(server, {
            // context: verifyJwt,
            context: setContext,
            listen : {
                port : Number(process.env.PORT as string) || 9000,
            }
        });
        console.log(`🚀 Server ready at ${url}`);
    })
    .catch((error) => console.log(error));
