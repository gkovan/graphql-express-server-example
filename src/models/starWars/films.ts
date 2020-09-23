
import { BFFError } from '../../errors/BFFError';
import { ErrorConstants } from '../../errors/ErrorConstants';
export type StarWarsFilm =
{
	starships: string[],
	edited: string,
	planets: string[],
	producer: string,
	title: string,
	url: string,
	releaseDate?: string,
	"release_date": string,
	vehicles: string[],
	episodeId?: number,
	"episode_id": number,
	director: string,
	created: string,
	openingCrawl?: string
	"opening_crawl": string
	characters: string[],
	species: string[]
};

type SingleFilm = { data: StarWarsFilm }
type MultipleFilms = { data: { results: StarWarsFilm[] }}

type Films = SingleFilm | MultipleFilms

type getFilmProps = {
	id?: number | null,
	loader: (options: {}) => Promise<Films>
}
export const getFilms = async ({ id = null, loader }: getFilmProps): Promise<StarWarsFilm[]> =>
{
	const options = id === null ? {
		method: "get",
		url: "https://swapi.dev/api/films"
	} : {
		method: "get",
		url: `https://swapi.dev/api/films/${id}`
	};

	const result: Films = await loader(options).catch(err =>
	{
		throw BFFError({
			message: err.message,
			code: ErrorConstants.INVOCATION_ERROR,
			path: [
				"models",
				"starWars",
				"films",
				"getFilms"
			]
		});
	});

	return id === null ? (result as MultipleFilms).data.results : [(result as SingleFilm).data];
};
