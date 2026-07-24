import Joi from 'joi';

export interface CatalogEnvironment {
  PORT: number;
  MONGODB_URI: string;
  MONGODB_DB: string;
}

const environmentSchema = Joi.object<CatalogEnvironment>({
  PORT: Joi.number().port().default(3002),
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
