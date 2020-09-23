import { Router } from 'express';

export const router = Router();

router.get('/readinessTest', async (req, res, next) =>
{
	res.send("OK");
});
