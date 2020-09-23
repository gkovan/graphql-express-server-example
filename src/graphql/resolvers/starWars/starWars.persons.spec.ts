import { createTestClient } from "apollo-server-testing";
import {resolvers } from "..";
import { typeDefs } from "../../schemas";
import { ApolloServer } from "apollo-server-express";
import testPersonData from '../../../models/starWars/persons.data.json';

describe("Test StarWars resolver", () =>
{
	it("Test retrieving one person", async (done) =>
	{
		const mockContext = {
			loader: () => (Promise.resolve({ data: testPersonData.results[1] })),
			log: { debug: jest.fn() }
		};

		const server = new ApolloServer({
			typeDefs,
			mocks: false,
			resolvers,
			context: mockContext
		});

		const { query } = createTestClient(server);

		const personQuery = `
        {
            starWars
            {
                persons (id: 1)
                {
                    starships
                    edited
                    name
                    created
                    url
                    gender
                    vehicles
                    skinColor
                    hairColor
                    height
                    eyeColor
                    mass
                    films
                    species
                    homeworld
                    birthYear
                }
            }
          }
        `;

		const result = await query({
			query: personQuery
		});

		expect(result.data!.starWars.persons).not.toBeNull();
		const { persons } = result.data!.starWars;
		expect(persons.length).toBe(1);
		expect(persons[0].name).toBe("C-3PO");
		expect(persons[0].skinColor).toBe("gold");
		expect(persons[0].mass).toBe("75");
		const keys = Object.keys(persons[0]);
		expect(keys.length).toBe(16);
		expect(keys).toContain("name");
		expect(keys).toContain("mass");
		expect(keys).toContain("height");
		expect(keys).toContain("films");

		done();
	});

	it("Test retrieving all persons", async (done) =>
	{
		const mockContext = {
			loader: () => (Promise.resolve({ data: testPersonData })),
			log: { debug: jest.fn() }
		};

		const server = new ApolloServer({
			typeDefs,
			mocks: false,
			resolvers,
			context: mockContext
		});

		const { query } = createTestClient(server);

		const personQuery = `
        {
            starWars
            {
                persons
                {
                    starships
                    edited
                    name
                    created
                    url
                    gender
                    vehicles
                    skinColor
                    hairColor
                    height
                    eyeColor
                    mass
                    films
                    species
                    homeworld
                    birthYear
                }
            }
          }
        `;

		const result = await query({
			query: personQuery
		});

		expect(result.data!.starWars.persons).not.toBeNull();
		const { persons } = result.data!.starWars;
		expect(persons.length).toBe(10);
		expect(persons[1].name).toBe("C-3PO");
		expect(persons[1].skinColor).toBe("gold");
		expect(persons[1].mass).toBe("75");
		const keys = Object.keys(persons[1]);
		expect(keys.length).toBe(16);
		expect(keys).toContain("name");
		expect(keys).toContain("mass");
		expect(keys).toContain("height");
		expect(keys).toContain("films");

		done();
	});

});
