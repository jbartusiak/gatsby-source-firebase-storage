export const pluginOptionsSchema = ({Joi}) =>
    Joi.object({
        credential: Joi.object().required(),
        storageBucket: Joi.string().required(),
        types: Joi.array().required(),
    });
