import merge from "lodash/merge";
import { IResolvers } from 'graphql-tools';
import { Query } from './Query';
import { Books } from './books/books';
import { StarWars } from './starWars/starWars';

export const resolvers: IResolvers = merge(Query, Books, StarWars);
