
import express from "express";
import { promptToPortfolio } from "../controllers/portfolio.js";

const promptRouter = express.Router();

promptRouter.post("/prompt",promptToPortfolio)

// promptRouter.get("/portfolio", getPortfolio)

export default promptRouter;