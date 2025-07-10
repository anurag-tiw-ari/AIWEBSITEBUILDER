
import express from "express";
import getSignature from "../controllers/imageSignature.js";

const imageRouter = express.Router();

imageRouter.get("/signature",getSignature)

export default imageRouter;