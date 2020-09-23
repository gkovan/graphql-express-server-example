import { IResolvers } from 'graphql-tools';

export const Query: IResolvers = {
	Query: {
		books: (): [] => [],
		starWars: (): [] => []
	}
};
