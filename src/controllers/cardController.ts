import { insert,CardInsertData } from "../repositories/cardRepository.js";
import { cardService } from "../services/cardService.js";

export async function createCard(req, res) {
    const card:CardInsertData = req.body;
    try {
     
      await insert(card);

      return res.sendStatus(200);

    } catch (error) {

      return res.status(500).send(error);
    }
}