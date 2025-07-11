
import express from "express";
import { promptToPortfolio, promptToWebsite } from "../controllers/portfolio.js";

const promptRouter = express.Router();

promptRouter.post("/prompt",promptToPortfolio)

promptRouter.post("/site/prompt",promptToWebsite)

// promptRouter.get("/portfolio", getPortfolio)

export default promptRouter;