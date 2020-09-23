import { scrubLogObject, rename, durationText, maskFilter, common, getCharactersAfter } from "./StringUtils";
import get from "lodash/get";
import config from "configuration-master";
import path from "path";

config.loadConfig(path.resolve(__dirname, "../../configuration.json"));

describe("Test the String utility functions", () =>
{
	afterEach(() =>
	{
		// axios.mockRestore();
	});

	describe("scrubLogObject", () =>
	{
		it("Test scrubLogObject to ensure it has no timestamp field in the object to conflict with logging", () =>
		{
			type logObject = { [key: string]: common };

			const testObject: logObject = {
				one: null,
				two: "test string",
				three: null,
				four: "someOtherString",
				five: 27,
				six: null
			};

			expect(testObject.timestamp).not.toBeDefined();

			const test1: logObject = scrubLogObject(testObject) as logObject;

			expect(test1.timestamp).not.toBeDefined();

			testObject.timestamp = "I am here";
			expect(testObject.timestamp).toBeDefined();

			const test2: logObject = scrubLogObject(testObject) as logObject;

			expect(test2.timestamp).not.toBeDefined();
			expect(test2.extTimestamp).toBeDefined();
		});

		it("should return itself if the input object is a string", () =>
		{
			expect(scrubLogObject("hello")).toEqual("hello");
		});
	});

	describe("rename", () =>
	{
		it("Test rename to ensure chsnges the name of object keys", () =>
		{
			const testObject = {
				one: null,
				two: "test string",
				three: null,
				four: "someOtherString",
				five: 27,
				six: null
			};

			const test1 = rename(testObject, "two", "nine");

			expect(test1.two).not.toBeDefined();
			expect(test1.nine).toBeDefined();
			expect(test1.nine).toBe("test string");
			expect(test1.one).toBe(null);
			expect(test1.three).toBe(null);
			expect(test1.four).toBe("someOtherString");
			expect(test1.five).toBe(27);
			expect(test1.six).toBe(null);
		});
	});

	describe("maskFilter", () =>
	{
		it("should replace specified fields with *-*-*-*-*-*-*-*", () =>
		{
			const mask = "*-*-*-*-*-*-*-*";

			const account = {
				firstName: "CAROLIN",
				lastName: "KIESE",
				cdpNumbers: {
					cdpName: "HERTZ EMPLOYEE DISCOUNT",
					cdpPreferred: true,
					id: "abcdefghi"
				},
				frequentTravelerNumbers: null,
				creditCards: [
					{
						id: "5962391",
						prefSetId: "2421503",
						prefId: "8412900",
						paymentAccountId: "5962391",
						creditCardType: "MC",
						creditCardNumber: "7AA86181A90030FC53C458C80DE742880D0A4EB6437407E12D843C763D820058",
						creditCardExpirationDate: "2021-04-01",
						creditCardMask: "XXXXXXXXXXXX1732",
						primaryCardIndicator: "Y",
						seqNum: 1,
						isHertzCard: "N",
						hertzChargeCardStatus: null
					},
					{
						id: "5962150",
						prefSetId: "2421503",
						prefId: "8412209",
						paymentAccountId: "5962150",
						creditCardType: "VSA",
						creditCardNumber: "2D8CC0A0DACA3AB5D894176DBAA060D67CD3E4817CCD0CF452DB9EA20C82CD12",
						creditCardExpirationDate: "2023-05-01",
						creditCardMask: "XXXXXXXXXXXX0026",
						primaryCardIndicator: "N",
						seqNum: 2,
						isHertzCard: "N",
						hertzChargeCardStatus: null
					}
				]
			};

			const filteredObj = maskFilter(account, ["firstname", "lastname", "id"], mask);

			expect(filteredObj.firstName).toEqual(mask);
			expect(filteredObj.lastName).toEqual(mask);
			expect(get(filteredObj, "cdpNumbers.id")).toEqual(mask);
			expect(get(filteredObj, "creditCards[0].id")).toEqual(mask);
			expect(get(filteredObj, "creditCards[1].id")).toEqual(mask);
		});

		it("should replace specified fields with default mask of ******", () =>
		{
			const mask = "******";

			const account = {
				firstName: "CAROLIN",
				lastName: "KIESE",
				cdpNumbers: {
					cdpName: "HERTZ EMPLOYEE DISCOUNT",
					cdpPreferred: true,
					id: "abcdefghi"
				},
				frequentTravelerNumbers: null,
				creditCards: [
					{
						id: "5962391",
						prefSetId: "2421503",
						prefId: "8412900",
						paymentAccountId: "5962391",
						creditCardType: "MC",
						creditCardNumber: "7AA86181A90030FC53C458C80DE742880D0A4EB6437407E12D843C763D820058",
						creditCardExpirationDate: "2021-04-01",
						creditCardMask: "XXXXXXXXXXXX1732",
						primaryCardIndicator: "Y",
						seqNum: 1,
						isHertzCard: "N",
						hertzChargeCardStatus: null
					},
					{
						id: "5962150",
						prefSetId: "2421503",
						prefId: "8412209",
						paymentAccountId: "5962150",
						creditCardType: "VSA",
						creditCardNumber: "2D8CC0A0DACA3AB5D894176DBAA060D67CD3E4817CCD0CF452DB9EA20C82CD12",
						creditCardExpirationDate: "2023-05-01",
						creditCardMask: "XXXXXXXXXXXX0026",
						primaryCardIndicator: "N",
						seqNum: 2,
						isHertzCard: "N",
						hertzChargeCardStatus: null
					}
				]
			};

			const filteredObj = maskFilter(account, ["firstname", "lastname", "id"]);

			expect(filteredObj.firstName).toEqual(mask);
			expect(filteredObj.lastName).toEqual(mask);
			expect(get(filteredObj, "cdpNumbers.id")).toEqual(mask);
			expect(get(filteredObj, "creditCards[0].id")).toEqual(mask);
			expect(get(filteredObj, "creditCards[1].id")).toEqual(mask);
		});
	});

	describe("durationText", () =>
	{
		it("should test date range to determine duration text", () =>
		{
			const startDate = new Date();
			const endDate = new Date();
			endDate.setHours(endDate.getHours() + 15, endDate.getMinutes() + 25, endDate.getSeconds() + 12);
			endDate.setFullYear(endDate.getFullYear() + 3, endDate.getMonth() + 5, endDate.getDate() + 7);

			const result = durationText({ start: startDate, end: endDate });
			expect(result).toBe("3 years 5 months 7 days 15 hours 25 minutes 12 seconds");
		});

		it("should test short date range to determine duration text", () =>
		{
			const startDate = new Date();
			const endDate = new Date();
			endDate.setHours(endDate.getHours() + 15, endDate.getMinutes(), endDate.getSeconds() + 1);

			const result = durationText({ start: startDate, end: endDate });
			expect(result).toBe("15 hours 0 minutes 1 second");
		});
	});

	describe("getCharactersAfter", () =>
	{
		it("test that characters after last 'this' are returned", () =>
		{
			const text = "Superman hates this, goes home";
			const result = getCharactersAfter(text, "this");
			expect(result).toBe(", goes home");
		});

		it("test that characters after last 'is' are returned", () =>
		{
			const text = "This is what is expectd.";
			const result = getCharactersAfter(text, "is");
			expect(result).toBe(" expectd.");
		});

	});
});
