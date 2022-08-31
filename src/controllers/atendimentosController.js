import { atendimentosRepository } from "../repositories/atendimentosRepository.js";

export async function getAtendimentos(req, res) {

    try {
      const atendimentos = await atendimentosRepository.getAll();
      return res.status(200).send(atendimentos.rows);
    } catch (error) {
      if (error.code==="23505"){
        return res.sendStatus(409);
      }
      return res.status(500).send(error);
    }
} 