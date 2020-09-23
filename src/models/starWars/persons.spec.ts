import { getPersons, StarWarsPerson } from './persons';
import testPersons from './persons.data.json';
import { getCharactersAfter } from "../../utilities/StringUtils";

const axios = require("axios");
axios.create.mockImplementation(() => axios);
jest.mock("axios");

type mockAxiosParams = {
	url: string,
	method: string
};

describe("Test StarWarsPerson", () =>
{
	afterEach(() =>
	{
		axios.mockRestore();
	});

	it("Test get all people", async(done) =>
	{
		const expectedUrl = `https://swapi.dev/api/people`;
		axios.mockImplementation(({ url, method }: mockAxiosParams):
            Promise<{data: { results: StarWarsPerson[] }} | string> =>
		{
			if ((url.indexOf(expectedUrl) !== -1) && (method === "get"))
			{
				return Promise.resolve({
					data: {
						results: testPersons.results
					}
				});
			}
			return Promise.resolve("err");
		});

		const result = await getPersons({ loader: axios });

		expect(result).not.toBeNull();
		expect(result.length).toBe(10);
		expect(result).toEqual(testPersons.results);

		done();
    });

    it("Test get single person", async(done) =>
	{
		const expectedUrl = `https://swapi.dev/api/people`;
		const testId = 1;
		axios.mockImplementation(({ url, method }: mockAxiosParams):
			Promise<{data: { results: StarWarsPerson[] }} | { data: StarWarsPerson } | string> =>
		{
			if ((url.indexOf(expectedUrl) !== -1) && (method === "get"))
			{
				console.log(url);
				const index = getCharactersAfter(url, "people/");
				return Promise.resolve({
					data: testPersons.results[parseInt(index, 10)]
				});
			}

			return Promise.resolve("err");
		});

		const result = await getPersons({ loader: axios, id: testId });

		expect(result).not.toBeNull();
		expect(result.length).toBe(1);
		expect(result[0]).toEqual(testPersons.results[testId]);

		done();

	});
});
