import Joi from 'joi';

export const environmentValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production')
    .default('development'),
  PORT: Joi.number().port().default(3004),
  TRANSBANK_ENVIRONMENT: Joi.string()
    .valid('integration', 'production')
    .default('integration'),
  TRANSBANK_COMMERCE_CODE: Joi.string().optional(),
  TRANSBANK_API_KEY: Joi.string().optional(),
  WEBPAY_RETURN_URL: Joi.string()
    .uri({ scheme: ['http', 'https'] })
    .default('http://localhost:5173/payments/result'),
});
