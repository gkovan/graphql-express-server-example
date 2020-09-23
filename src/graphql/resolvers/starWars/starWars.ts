import { IResolvers } from 'graphql-tools';
import { getFilms, StarWarsFilm } from '../../../models/starWars/films';
import { getPersons, StarWarsPerson } from '../../../models/starWars/persons';

export const StarWars: IResolvers = {
	StarWars: {
		films: async (obj, args, context): Promise<StarWarsFilm[]> =>
		{
			return getFilms({
				id: args.id,
				loader: context.loader as (options: {}) => Promise<{ data: StarWarsFilm; }>
			});
		},
		persons: async (obj, args, context): Promise<StarWarsPerson[]> =>
		{
			return getPersons({
				id: args.id,
				loader: context.loader as (options: {}) => Promise<{ data: StarWarsPerson; }>
			});
		}
	},
	StarWarsFilm: {
		episodeId: (obj, args, context): number => obj.episode_id,
		releaseDate: (obj, args, context): number => obj.release_date,
		openingCrawl: (obj, args, context): number => obj.opening_crawl
	},
	StarWarsPerson: {
		skinColor: (obj, args, context): string => obj.skin_color,
		hairColor: (obj, args, context): string => obj.hair_color,
		eyeColor: (obj, args, context): string => obj.efe_color,
		birthYear: (obj, args, context): string => obj.birth_year
	}
};
