import { Router } from "express";
import { verifyApiKey } from "../middlewares/verifyApiKey.js";
import { validateSchema } from "../middlewares/schemasValidator.js";
import  rechargeSchema from "../schemas/rechargeSchema.js";
import { rechargeCard } from "../controllers/rechargeController.js";

const rechargeRouter = Router();

rechargeRouter.post("/recharge/:id", verifyApiKey, validateSchema(rechargeSchema), rechargeCard); //id do cartao que se quer carregar

export default rechargeRouter;