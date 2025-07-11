import express from "express"
import deployWithNetlify from "../controllers/deploywebsite.js";

const deployRouter = express.Router();

deployRouter.post("/netlify",deployWithNetlify)

export default deployRouter