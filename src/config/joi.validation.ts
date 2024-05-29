import * as Joi from "joi";



export const JoiValidationShchema = Joi.object({
    PORT: Joi.number(),
    MONGO_URI: Joi.required().default(3000),
    DEFAULT_LIMIT: Joi.number().default(6),
});