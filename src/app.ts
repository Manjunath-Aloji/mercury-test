import { ApolloServer } from "@apollo/server";
import mercury from "@mercury-js/core";
import { mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge";
import "./models/index.ts";
import "./profiles/index.ts";

import { customUserResolvers, customUserTypeDef } from "./controllers/user.controller.ts";

const mergedTypeDefs = mergeTypeDefs(
    [
        mercury.typeDefs, 
        customUserTypeDef
    ]
);
const mergedResolvers = mergeResolvers(
    [
        mercury.resolvers, 
        customUserResolvers
    ]
);

// mercury.addGraphqlSchema(userTypeDef, userResolvers);

const server = new ApolloServer({
    // typeDefs: mercury.typeDefs,
    // resolvers: mercury.resolvers,
    typeDefs: mergedTypeDefs,
    resolvers: mergedResolvers,
});

export default server;
