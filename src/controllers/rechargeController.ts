import { Request, Response } from "express";
import  { rechargeService }  from "../services/rechargeService.js";


export async function rechargeCard(req: Request, res: Response) {
	const data = req.body;
	const { id } = req.params;
	const apikey = res.locals.key;

	await rechargeService(Number(id), Number(data.value), apikey);

	res.status(201).send("Recarga efetuada.");
}