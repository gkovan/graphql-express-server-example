import Query from './Query.graphql';
import { bookQueries } from "./books/index";
import { starWarsQueries } from './starWars/index';


export const queries = [
	Query,
	...bookQueries,
	...starWarsQueries
];
