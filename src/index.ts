import dotenv from "dotenv";

dotenv.config({
    path: "./.env",
});

import connectDb from "./database/db.connection.ts";
import { startStandaloneServer } from "@apollo/server/standalone";

import server from "./app.ts";
import verifyJwt from "./middlewares/auth.middleware.ts";

connectDb()
    .then(async () => {
        // app.listen(3000, () => console.log("Server is running on port 3000"))3
        const { url } = await startStandaloneServer(server, {
            context: verifyJwt,
            // listen : {
            //     host : "https://mercury-test.onrender.com/",
            //     port : Number(process.env.DB_URL as string) || 9000,
            // }
            // listen : {
            //     port : 9000
            // }
        });
        console.log(`🚀 Server ready at ${url}`);
    })
    .catch((error) => console.log(error));
