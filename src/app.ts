import { ApolloServer } from "@apollo/server";
// import {
//     ApolloServerPluginLandingPageLocalDefault,
//     ApolloServerPluginLandingPageProductionDefault,
// } from "@apollo/server/plugin/landingPage/default";
import mercury from "@mercury-js/core";
import { mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge";
import "./models/index.ts";
import "./profiles/index.ts";

import {
    customUserResolvers,
    customUserTypeDef,
} from "./controllers/user.controller.ts";

const mergedTypeDefs = mergeTypeDefs([mercury.typeDefs, customUserTypeDef]);
const mergedResolvers = mergeResolvers([
    mercury.resolvers,
    customUserResolvers,
]);

// mercury.addGraphqlSchema(userTypeDef, userResolvers);

const server = new ApolloServer({
    introspection: true,
    typeDefs: mergedTypeDefs,
    resolvers: mergedResolvers,
    // plugins: [
    //     process.env.NODE_ENV === "production"
    //         ? ApolloServerPluginLandingPageProductionDefault({
    //               graphRef: "My-Graph-dh3i1@my-graph-variant",
    //               embed: true,
    //           })
    //         : ApolloServerPluginLandingPageLocalDefault({ footer: false }),
    // ],
});

export default server;

// user:fp.7811eee0-b049-4181-ad21-b6cabc7747c3:6TtdKAxLkqBezQA9lpXMcQ
