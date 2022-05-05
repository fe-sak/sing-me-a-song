import { Router } from "express";
import * as controller from "../controllers/testController.js";
const testRouter = Router();

testRouter.delete("/recommendations", controller.clearRecommendations);

export default testRouter;
