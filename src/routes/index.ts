import { Router } from "express";
export const router = Router();

router.use("/", require("./logging").router);
router.use("/", require("./graphql").router);
router.use("/api", require("./api").router);
router.use("/", require("./readyTest").router);
