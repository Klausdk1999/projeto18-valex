import { Router } from "express";
import getAtendimentos from "../controllers/atendimentosController.js";
import validateSchema from "../middlewares/schemaValidation.js";
import {Schema} from "../schemas/Schema.js";
const atendimentoRouter = Router();

atendimentoRouter.get("/atendimentos",getAtendimentos);
//atendimentoRouter.post("/atendimento", validateSchema(cakeSchema), postCake);

export default atendimentoRouter;