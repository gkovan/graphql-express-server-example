import { getFilms, StarWarsFilm} from "./films";
import testFilms from './films.data.json';
import { getCharactersAfter } from "../../utilities/StringUtils";

const axios = require("axios");
axios.create.mockImplementation(() => axios);
jest.mock("axios");

type mockAxiosParams = {
	url: string,
	method: string
};

describe("Test film model", () =>
{
	afterEach(() =>
	{
		axios.mockRestore();
	});

	it("test multiple film retrieval", async (done) =>
	{
		const expectedUrl = `https://swapi.dev/api/films`;
		axios.mockImplementation(({ url, method }: mockAxiosParams): Promise<{data: { results: StarWarsFilm[] }} | string> =>
		{
			if ((url.indexOf(expectedUrl) !== -1) && (method === "get"))
			{
				return Promise.resolve({
					data: {
						results: testFilms.results
					}
				});
			}

			return Promise.resolve("err");
		});

		const result = await getFilms({ loader: axios });

		expect(result).not.toBeNull();
		expect(result.length).toBe(6);
		expect(result).toEqual(testFilms.results);

		done();

	});

	it("test single film retrieval", async (done) =>
	{
		const expectedUrl = `https://swapi.dev/api/films/`;
		const testId = 3;
		axios.mockImplementation(({ url, method }: mockAxiosParams):
			Promise<{data: { results: StarWarsFilm[] }} | { data: StarWarsFilm } | string> =>
		{
			if ((url.indexOf(expectedUrl) !== -1) && (method === "get"))
			{
				const index = getCharactersAfter(url, "films/");
				return Promise.resolve({
					data: testFilms.results[parseInt(index, 10)]
				});
			}

			return Promise.resolve("err");
		});

		const result = await getFilms({ loader: axios, id: testId });

		expect(result).not.toBeNull();
		expect(result.length).toBe(1);
		expect(result[0]).toEqual(testFilms.results[testId]);

		done();

	});

});
