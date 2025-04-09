import { ApolloServer } from "@apollo/server";
// import {
//     ApolloServerPluginLandingPageLocalDefault,
//     ApolloServerPluginLandingPageProductionDefault,
// } from "@apollo/server/plugin/landingPage/default";
import mercury from "@mercury-js/core";
import { mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge";
import { makeExecutableSchema } from '@graphql-tools/schema';

import "./models/index.ts";
import "./profiles/index.ts";

import {
    customUserResolvers,
    customUserTypeDef,
} from "./controllers/user.controller.ts";

const globalTypeDef = `
    input ImageUploadInput {
        file_name: String!
        base64: String!
    }
`;

const mergedTypeDefs = mergeTypeDefs([
    globalTypeDef,
    mercury.typeDefs,
    customUserTypeDef,
]);

const mergedResolvers = mergeResolvers([
    mercury.resolvers,
    customUserResolvers,
]);

// mercury.addGraphqlSchema(customUserTypeDef, customUserResolvers)

const server = new ApolloServer({
    introspection: true,
    schema: makeExecutableSchema({
        typeDefs: mergedTypeDefs,
        resolvers: mergedResolvers,
    }),
    // typeDefs: mergedTypeDefs,
    // resolvers: mergedResolvers,
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
