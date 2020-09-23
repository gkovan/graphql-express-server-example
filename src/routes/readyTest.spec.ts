import express from "express";
const { router } = require("../routes/readyTest");
import request from "supertest";
const app = express();
const OK = 200;
const NOT_FOUND = 404;

app.use("/", router);

describe("Test readyTest endpoint", () =>
{
	it("Test get request", done =>
	{
		request(app).
			get("/readinessTest").
			expect(OK).
			end((err, res) =>
			{
				if (err != null)
				{
					return done(err);
				}

				expect(res.text).toBe("OK");
				return done();
			});
	});

	it("Test post request", done =>
	{
		request(app).
			post("/readinessTest").
			expect(NOT_FOUND).
			end((err, res) =>
			{
				if (err != null)
				{
					return done(err);
				}

				expect(res.text).toContain("Cannot POST /readinessTest");
				return done();
			});
	});
});
