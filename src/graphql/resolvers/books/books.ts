import { IResolvers } from 'graphql-tools';

export const Books: IResolvers = {
	Books:
	{
		getBooks: (): { title: string, author: string }[] =>
		{
			return [
				{
					title: 'Harry Potter and the Chamber of Secrets',
					author: 'J.K. Rowling'
				},
				{
					title: 'Jurassic Park',
					author: 'Michael Crichton'
				}
			];
		}
	}
};
