import Joi from 'joi';

export interface CatalogEnvironment {
  PORT: number;
  RABBITMQ_URL: string;
  RABBITMQ_QUEUE: string;
  RABBITMQ_PREFETCH: number;
  MONGODB_URI: string;
  MONGODB_DB: string;
}

const environmentSchema = Joi.object<CatalogEnvironment>({
  PORT: Joi.number().port().default(3002),
  RABBITMQ_URL: Joi.string().uri().required(),
  RABBITMQ_QUEUE: Joi.string().min(1).default('catalog_queue'),
  RABBITMQ_PREFETCH: Joi.number().integer().min(1).default(10),
  MONGODB_URI: Joi.string()
    .pattern(/^mongodb(\+srv)?:\/\//)
    .required(),
  MONGODB_DB: Joi.string().min(1).default('catalog'),
}).unknown(true);

export function validateEnvironment(
  config: Record<string, unknown>,
): CatalogEnvironment {
  const { error, value } = environmentSchema.validate(config, {
    abortEarly: false,
    convert: true,
  });

  if (error) {
    throw new Error(`Invalid environment configuration: ${error.message}`);
  }

  return value;
}
