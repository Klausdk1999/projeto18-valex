import { Router } from "express";
import { verifyApiKey } from "../middlewares/verifyApiKey.js";
import { validateSchema } from "../middlewares/schemasValidator.js";
import typeCards from "../schemas/typeCardsSchema.js"
import { newCard, activateCard, sendCards, sendBalanceAndTransactions,blockCard,unblockCard } from "../controllers/CardController.js";

const cardsRouter = Router();

cardsRouter.post("/cards", verifyApiKey, validateSchema(typeCards), newCard);
cardsRouter.put("/activatecard", activateCard);
cardsRouter.get("/card", sendCards);
cardsRouter.get("/balance/:id", sendBalanceAndTransactions);
cardsRouter.post("/block", blockCard);
cardsRouter.post("/unblock", unblockCard);

export default cardsRouter;