import { createZodDto } from 'nestjs-zod/dto'
import { z } from 'nestjs-zod/z'

export const BaseQueryInputSchema = z.object({
  sortBy: z.enum(['asc', 'desc', 'ASC', 'DESC']).optional().describe('SortBy'),
  skip: z.coerce
    .number()
    .int({
      message: 'Los parámetros de paginación deben ser un número entero.',
    })
    .optional()
    .describe('Skip'),
  take: z.coerce
    .number()
    .int({
      message: 'Los parámetros de paginación deben ser un número entero.',
    })
    .positive({
      message: 'Los parámetros de paginación deben ser un número positivo.',
    })
    .optional()
    .describe('Take'),
})

export class BaseQueryInputDto extends createZodDto(BaseQueryInputSchema) {}
