import { ApolloServer } from 'apollo-server-express';
import { Router, Application } from 'express';
import { typeDefs } from "../graphql/schemas/index";
import { resolvers } from "../graphql/resolvers/index";
import { Logger } from 'winston';

export const router = Router();

interface AugmentedRequest extends Request {
	log: Logger,
	context?: { [key: string]: any }
}

const apollo = new ApolloServer({
	typeDefs,
	resolvers,
	context: ({ req, res }) =>
	{
		return (req as unknown as AugmentedRequest).context;
	}
	// tracing: false,
	// cacheControl: {
	// 	defaultMaxAge: 86400
	// },
	// introspection: true
});

apollo.applyMiddleware({ app: router as Application, path: "/graphql" });
