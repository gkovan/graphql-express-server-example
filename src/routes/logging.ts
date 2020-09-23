import { createLogger, format, transports, Logger } from "winston";
import { Router, Request, Response, NextFunction } from "express";
import config from "configuration-master";
import { v4 as uuid } from "uuid";
import { maskFilter } from "../utilities/StringUtils";

import https from "https";
import axios from "axios";
import omit from "lodash/omit";

const { combine, timestamp, printf } = format as { [key: string]: any };
export const router = Router();

const myFormat = printf((keys: { [key: string]: any }) =>
	`[${keys.timestamp}] {${keys.id}} (${keys.level}) ${keys.label != null ? `${keys.label} - ` : ""
	}${keys.message} `);

const mod = (format as Function)((info: { [key: string]: any }, opts: { [key: string]: any }) =>
{
	info.id = opts.id;
	info.level = info.level != null ? info.level.toUpperCase() : null;

	return info;
});

const piiKeys = (config as { [key: string]: any }).logging.piiFilter.map((key: string) => key.toLowerCase());

const filterFormat = (format as Function)((info: { [key: string]: any }, opts: { [key: string]: any }) =>
{
	return maskFilter(info, piiKeys);
})();

export const logger = createLogger({
	// maxRetries: 3,
	level: (config as { [key: string]: any }).logging.level.toLowerCase(),
	format: combine(timestamp(), mod({ id: uuid() }), myFormat)
	// defaultMeta: { service: 'user-service' },
});

if ((config as { [key: string]: any }).logging.consoleEnabled === true)
{
	logger.add(new (transports as { [key: string]: any }).Console({
		format: combine(filterFormat, (format as { [key: string]: any }).json())
	}));
}

interface AugmentedRequest extends Request {
	log: Logger,
	context?: { [key: string]: any }
}

export const preProcessRequest = (req: AugmentedRequest, res: Response, next: Function): void =>
{
	//use to specify CA if needed again in future
	const axiosInstance = (axios as { [key: string]: any }).create({
		// httpsAgent: new https.Agent({ ca: ca_bundle })
		httpsAgent: new https.Agent({
			rejectUnauthorized: false
		})
	});

	axiosInstance.interceptors.request.use((request: Request) =>
	{
		if (request.url.substring(request.url.length - 5) !== ".json")
		{
			req.log.debug({
				message: `request ${request.method}: ${request.url}`,
				request: omit(request, [
					"httpAgent",
					"httpsAgent"
				])
			});
		}
		return request;
	});
	axiosInstance.interceptors.response.use((response: any) =>
	{
		if (
			response.config.url.substring(response.config.url.length - 5) !== ".json"
		)
		{
			req.log.debug({
				message: `response ${response.config.method}: ${response.config.url}`,
				response: response.data
			});
		}
		return response;
	});

	req.context = { log: req.log, loader: axiosInstance };
};

const loggingSetup = (req: AugmentedRequest, res: Response, next: NextFunction) =>
{
	logger.format = combine(timestamp(), mod({ id: uuid() }), myFormat);

	req.log = logger;

	preProcessRequest(req, res, next);

	next();
	res.on("finish", () =>
	{
		req.log = null!;
		req.context = null!;
	});
};

// @ts-ignore don't know how to cast from Application to AugmentedRequest in typescript
router.use("/", loggingSetup);
