import mapValues from "lodash/mapValues";
import isPlainObject from "lodash/isPlainObject";
import isArray from "lodash/isArray";
import intervalToDuration from "date-fns/intervalToDuration";

// const numCheck = new RegExp("^[0-9]+$");

export type common = string | number | boolean | Object | null;
export const scrubLogObject = (obj: { [key: string]: common } | string): common =>
{
	if (typeof obj === "string")
	{
		return obj;
	}
	return Object.keys(obj).reduce((acc: { [key: string]: common }, key) =>
	{
		if (key === "timestamp")
		{
			acc.extTimestamp = obj.timestamp;
		}
		else
		{
			acc[key] = obj[key];
		}
		return acc;
	}, {});
};

export const rename = (obj: { [key: string]: common }, from: string, to: string) =>
{
	return Object.keys(obj).reduce((acc: { [key: string]: common }, key) =>
	{
		if (key === from)
		{
			acc[to] = obj[key];
		}
		else
		{
			acc[key] = obj[key];
		}
		return acc;
	}, {});
};

export const maskFilter = (
	obj: { [key: string]: common },
	keys: string[], mask?: string
): { [key: string]: common } =>
{
	return mapValues(obj, (value, key) =>
	{
		if (isPlainObject(value))
		{
			return maskFilter(value as any, keys, mask);
		}
		else if (isArray(value))
		{
			return value.map(item => maskFilter(item, keys, mask));
		}

		return keys.includes(key.toLowerCase()) ? mask || "******" : value;
	});
};

type durationProps = { start: Date, end: Date };
export const durationText = ({ start, end }: durationProps): string =>
{
	const units = [
		"year",
		"month",
		"day",
		"hour",
		"minute",
		"second"
	];

	const duration: Duration = intervalToDuration({
		start,
		end
	});

	const response: string[] = [];
	let required = false;

	units.forEach((unit, index) =>
	{
		if (((duration[`${unit}s` as keyof Duration] || 0) > 0) || (required === true) || (index === (units.length - 1)))
		{
			response.push(`${duration[`${unit}s` as keyof Duration]} ${unit}${duration[`${unit}s` as keyof Duration] === 1 ? "" : "s"}`);
			required = true;
		}
	});

	return response.join(" ");
};

export const getCharactersAfter = (text: string, matcher: string) =>
{
	const ptr = text.lastIndexOf((matcher));
	return text.substring(ptr + matcher.length);
};
