import { z } from 'nestjs-zod/z'

export const ConfigEnvSchema = z.object({
  SERVER_PORT: z.coerce.number().optional().default(5000),
  SERVER_CRYPTO_PWD: z.string(),
  SOURCE_EMAIL_SENDER: z.string().email(),
  SOURCE_EMAIL_SENDER_PWD: z.string(),
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
  DB_HOST: z.string(),
  DB_PORT: z.coerce.number().optional().default(5432),
})
export type ConfigEnv = z.infer<typeof ConfigEnvSchema>
