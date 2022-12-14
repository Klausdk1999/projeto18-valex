import { faker } from "@faker-js/faker";
import { findByApiKey } from "../repositories/companyRepository.js";
import { findById } from "../repositories/employeeRepository.js";
import { findByTypeAndEmployeeId,TransactionTypes,insert } from "../repositories/cardRepository.js";
import * as rechargeRepository from "../repositories/rechargeRepository.js";
import * as paymentRepository from "../repositories/paymentRepository.js";
import Cryptr from "cryptr";
import dotenv from "dotenv";
import * as cardRepository from "../repositories/cardRepository.js"
import { Request, Response } from "express";

dotenv.config();

export async function newCard(
	apiKey: string,
	type: TransactionTypes,
	employeeId: number
) {
	const cryptr = new Cryptr(process.env.SECRET);

	const isKeyValid = await findByApiKey(apiKey);

	if (!isKeyValid) throw { code: "Anauthorized", message: "Api key inválida." };

	const isEmployeeRegistred = await findById(employeeId);

	if (!isEmployeeRegistred)
		throw { code: "NotFound", message: "Empregado/usuário não encontrado" };

	const cardsOfEmployee = await findByTypeAndEmployeeId(type, employeeId);

	if (cardsOfEmployee)
		throw {	code: "Conflict", message: "Cartão já registrado para esse empregado/usuário.",};

	const cardholderName = await cardName(isEmployeeRegistred.fullName);

	const expirationDate = await expireDate();

	const securityCode = cryptr.encrypt(faker.finance.creditCardCVV());

	const number = faker.finance.creditCardNumber();

	await insert({
		employeeId,
		number,
		cardholderName,
		securityCode,
		expirationDate,
		isVirtual: false,
		isBlocked: true,
		type,
	});
}

async function cardName(name: string) {
	const separateName = name.split(" ").filter((elem) => elem.length >= 3);

	const nameForCard = separateName
		.map((elem: string, index: number, array: []) => {
			if (index !== 0 && index !== array.length - 1) {
				return elem.slice(0, 1);
			} else {
				return elem;
			}
		}).join(" ").toUpperCase();

	return nameForCard;
}

async function expireDate() {
	const expireDate = new Date();
	const year = String(expireDate.getFullYear() + 5);
	//const month = expireDate.getMonth();
	const month = (expireDate.getMonth() + 1).toString().padStart(2, "0");

	return `${month}/${year.slice(-2)}`;
}

export async function activateCard(id:number, newPassword:string, code: string) {
	
	const cryptr = new Cryptr(process.env.SECRET);
	const card = await cardRepository.findById(id)

	if(!card)
		throw {code: "NotFound", message: "Cartão não encontrado"}

	if(checkExpirationDate(card.expirationDate))
		throw {code: "BadRequest", message: "O cartão está vencido"}

	if(card.password)
		throw {code: "BadRequest", message: "O cartão está ativo"}
	
	const cvc = cryptr.decrypt(card.securityCode);
	console.log(cvc)
	if(cvc!==code)
		throw {code: "Anauthorized", message: "O Código de Verificação de Cartão (CVC) está errado"}
	
	if(newPassword.length !== 4)
		throw {code: "WrongType", message: "A senha precisa ter 4 (quatro) dígitos"}

	const password = cryptr.encrypt(newPassword);
	await cardRepository.update(id, { password });

}

export function checkExpirationDate(expirationDate: string) {
	const date = new Date();
	const year = String(date.getFullYear());
	const month = (date.getMonth() + 1).toString().padStart(2, "0");
	const actualDate = `${month}/${year.slice(-2)}`;

	if (actualDate > expirationDate) {
		return true;
	} else {
		return false;
	}
}

export async function sendCards(id: number, passwords: string[]) {
    const cryptr = new Cryptr(process.env.SECRET);
    const card = await cardRepository.findByEmployeeId(id);
    
    if (!card.length) return {};

    const sendInformations = card.map((elem, index) => {
        const decodedPassword = cryptr.decrypt(elem.password);
        if (passwords.some((elem) => elem == decodedPassword)) {
            const numberWithoutDash = elem.number.split("-").join(" ");
			
            return {
                number: numberWithoutDash,
                cardholderName: elem.cardholderName,
                expirationDate: elem.expirationDate,
                securityCode: cryptr.decrypt(elem.securityCode),
            };
        } else {
            return "Senha/Cartão inválidos";
        }
    });
	
    return { cards: sendInformations };
}

export async function sendBalanceAndTransactions(id: number) {

	const transactions = await paymentRepository.findByCardId(id);
    const recharges = await rechargeRepository.findByCardId(id);

    const totalTransactions: any = sumValues(transactions, "amount")
    const totalRecharge: any = sumValues(recharges, "amount")

    const balance: number = totalRecharge - totalTransactions;
    return {
        balance,
        transactions,
        recharges
    }
}

function sumValues(array: any[], key: string): number {

    const keyValues: any[] = array.map(el => el[key])

    return keyValues.reduce((current: number, sum: number) => sum + current, 0);

}

export async function blockCard(id: number, password: string) {

	const cryptr = new Cryptr(process.env.SECRET);

	const card = await cardRepository.findById(id);

	if (!card) throw { code: "NotFound", message: "Cartão não encontrado." };

	const decodedPassword = cryptr.decrypt(card.password);

	if (decodedPassword !== password)
		throw { code: "Anauthorized", message: "Senha incorreta." };

	if (checkExpirationDate(card.expirationDate))
		throw { code: "BadRequest", message: "Cartão expirado." };

	if (card.isBlocked)
		throw { code: "BadRequest", message: "Cartão já bloqueado." };

	await cardRepository.update(id, { isBlocked: true });
}

export async function unblockCard(id: number, password: string) {

	const cryptr = new Cryptr(process.env.SECRET);

	const card = await cardRepository.findById(id);

	if (!card)
		throw { code: "NotFound", message: "Cartão não encontrado." };

	const decodedPassword = cryptr.decrypt(card.password);

	if (decodedPassword !== password)
		throw { code: "Anauthorized", message: "Senha incorreta." };

	if (checkExpirationDate(card.expirationDate))
		throw { code: "BadRequest", message: "Cartão expirado." };

	if (!card.isBlocked)
		throw { code: "BadRequest", message: "Cartão já está desbloqueado." };

	await cardRepository.update(id, { isBlocked: false });
}

