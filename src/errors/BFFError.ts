
import { GraphQLError } from 'graphql';
import { ErrorConstants } from './ErrorConstants';

type BFFErrorProps = {
	message: string,
	code: ErrorConstants,
	path?: string[],
	originalError?: Error,
	extensions?: Object
}
export const BFFError = ({
	message,
	code,
	path,
	originalError,
	extensions
}: BFFErrorProps): GraphQLError =>
{
	return new GraphQLError(message, null!, null, null, path, originalError, {
		code: code || 400,
		...extensions
	});
};
