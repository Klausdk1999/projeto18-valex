import { Request, Response } from "express";
import * as paymentsServices from "../services/paymentService.js";

export async function cardPayments(req: Request, res: Response) {
	const { id } = req.params;
	const data = req.body;

	await paymentsServices.cardPayments(
		Number(id),
		Number(data.idCard),
		data.password,
		Number(data.value)
	);

	res.status(201).send("Pagamento efetuado.");
}