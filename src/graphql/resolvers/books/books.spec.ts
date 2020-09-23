import { createTestClient } from "apollo-server-testing";
import { resolvers } from "../../resolvers";
import { typeDefs } from "../../schemas";
import { ApolloServer } from "apollo-server-express";

const mockContext = {
	loader: jest.fn().mockResolvedValue(null),
	log: {
		debug: jest.fn()
	}
};
describe("Test Books resolver", () =>
{
	const server = new ApolloServer({
		typeDefs,
		mocks: {
			Book: () => ({
				title: "niall",
				author: "cargill"
			})
		},
		resolvers,
		context: mockContext
	});

	it("test getBooks", async (done) =>
	{
		const bookQuery = `
			{
				books
				{
					getBooks
					{
						title
						author
					}
				}
			}
		`;

		const { query } = createTestClient(server);

		const result = await query({
			query: bookQuery
		});

		expect(result).not.toBeNull();
		// console.log(JSON.stringify(result.data));
		done();
	});
});
