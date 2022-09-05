import Joi from "joi";

const rechargeSchema = Joi.object({
    value: Joi.number().greater(0).required(),
});

export default rechargeSchema;