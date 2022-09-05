import { Router } from "express";
import { validateSchema } from "../middlewares/schemasValidator.js";
import { cardPayments } from "../controllers/paymentController.js";
import paymentSchema from "../schemas/paymentSchema.js";

const paymentRouter = Router();

paymentRouter.post("/payments/:id", validateSchema(paymentSchema), cardPayments); //id do estabelecimento no param

export default paymentRouter;