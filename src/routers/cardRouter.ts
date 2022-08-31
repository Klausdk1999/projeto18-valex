import { Router } from "express";
import {createCard} from "../controllers/cardController.js";
import validateSchema from "../middlewares/schemaValidation.js";
import { cardSchema } from "../schemas/cardSchema.js";
import { cardService } from "../services/cardService.js";
//import {Schema} from "../schemas/Schema.js";

const cardRouter = Router();

cardRouter.post("/card",validateSchema(cardSchema),cardService,createCard);
//atendimentoRouter.post("/atendimento", validateSchema(cakeSchema), postCake);

export default cardRouter;