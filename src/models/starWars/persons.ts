import { BFFError } from '../../errors/BFFError';
import { ErrorConstants } from '../../errors/ErrorConstants';

export type StarWarsPerson =
{
	starships: string[],
	edited: string,
	name: string,
	created: string,
	url: string,
	gender: string,
    vehicles: string[],
    skinColor?: string,
    "skin_color": string,
    hairColor?: string,
	"hair_color": string,
    height: string,
    eyeColor?: string,
	"eye_color": string,
	mass: string,
	films: string[],
	species: string[],
    homeworld: string,
    birthYear?: string,
	"birth_year": string
};

type SinglePerson = { data: StarWarsPerson }
type MultiplePersons = { data: { results: StarWarsPerson[] }}

type Persons = SinglePerson | MultiplePersons

type getPersonProps = {
	id?: number | null,
	loader: (options: {}) => Promise<Persons>
}

export const getPersons = async ({ id = null, loader }: getPersonProps): Promise<StarWarsPerson[]> =>
{
	const options = id === null ? {
		method: "get",
		url: "https://swapi.dev/api/people"
	} : {
		method: "get",
		url: `https://swapi.dev/api/people/${id}`
	};

	const result: Persons = await loader(options).catch(err =>
	{
		throw BFFError({
			message: err.message,
			code: ErrorConstants.INVOCATION_ERROR,
			path: [
				"models",
				"starWars",
				"persons",
				"getPersons"
			]
		});
	});

	return id === null ? (result as MultiplePersons).data.results : [(result as SinglePerson).data];

};
