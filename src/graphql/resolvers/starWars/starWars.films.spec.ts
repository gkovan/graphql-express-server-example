import { createTestClient } from "apollo-server-testing";
import { resolvers } from "..";
import { typeDefs } from "../../schemas";
import { ApolloServer } from "apollo-server-express";
import testFilmData from '../../../models/starWars/films.data.json';


describe("Test StarWars resolver", () =>
{
	it("test retrieving one film", async (done) =>
	{
		const mockContext = {
			loader: () => (Promise.resolve({ data: testFilmData.results[2] })),
			log: {
				debug: jest.fn()
			}
		};

		const server = new ApolloServer({
			typeDefs,
			mocks: false,
			resolvers,
			context: mockContext
		});

		const { query } = createTestClient(server);

		const filmQuery = `
			{
				starWars
				{
					films (id: 1)
					{
						title
						planets
						producer
						species,
						starships
						edited
						releaseDate
						vehicles
						episodeId
						director
						created
						openingCrawl
						characters
						species
					}
				}
		  	}
		`;

		const result = await query({
			query: filmQuery
		});

		expect(result.data!.starWars.films).not.toBeNull();
		const { films } = result.data!.starWars;
		expect(films.length).toBe(1);
		expect(films[0].title).toBe("Return of the Jedi");
		expect(films[0].episodeId).toBe(6);
		expect(films[0].openingCrawl).toContain("Luke Skywalker");
		const keys = Object.keys(films[0]);
		expect(keys.length).toBe(13);
		expect(keys).toContain("title");
		expect(keys).toContain("planets");
		expect(keys).toContain("producer");
		expect(keys).toContain("species");

		done();
	});

	it("test retrieving all films", async (done) =>
	{
		const mockContext = {
			loader: () => (Promise.resolve({ data: testFilmData })),
			log: {
				debug: jest.fn()
			}
		};

		const server = new ApolloServer({
			typeDefs,
			mocks: false,
			resolvers,
			context: mockContext
		});

		const { query } = createTestClient(server);

		const filmQuery = `
			{
				starWars
				{
					films
					{
						title
						planets
						producer
						species,
						starships
						edited
						releaseDate
						vehicles
						episodeId
						director
						created
						openingCrawl
						characters
						species
					}
				}
		  	}
		`;

		const result = await query({
			query: filmQuery
		});

		expect(result.data!.starWars.films).not.toBeNull();
		const { films } = result.data!.starWars;
		expect(films.length).toBe(6);
		expect(films[1].title).toBe("The Empire Strikes Back");
		expect(films[1].episodeId).toBe(5);
		expect(films[1].openingCrawl).toContain("fighters led by Luke Skywalker");
		const keys = Object.keys(films[1]);
		expect(keys.length).toBe(13);
		expect(keys).toContain("title");
		expect(keys).toContain("planets");
		expect(keys).toContain("producer");
		expect(keys).toContain("species");

		done();
	});
});
