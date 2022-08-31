import joi from "joi";

export const cardSchema = joi.object({
    employeeId: joi.number().required(),
    number: joi.string().required(),
    cardholderName:  joi.string().required(),
    securityCode:  joi.string().required(),
    expirationDate:  joi.string().required(),
    password: joi.string().optional(),
    isVirtual: joi.boolean().required(),
    originalCardId: joi.number().optional(),
    isBlocked: joi.boolean().required(),
    type: joi.string().required().allow("groceries", "restaurant", "transport", "education", "health"),
}); 