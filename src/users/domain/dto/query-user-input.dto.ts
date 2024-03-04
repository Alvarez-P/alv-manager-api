import { createZodDto } from 'nestjs-zod/dto'
import { z } from 'nestjs-zod/z'
import { BaseQueryInputSchema } from 'src/core/domain/dto/base-query.dto'

const UserQueryInputSchema = z
  .object({
    orderBy: z
      .enum(['id', 'username', 'firstName', 'lastName', 'email', 'createdAt'], {
        errorMap: () => ({ message: 'El ordenamiento es inválido.' }),
      })
      .optional()
      .describe('OrderBy'),
  })
  .merge(BaseQueryInputSchema)

export class UserQueryInputDto extends createZodDto(UserQueryInputSchema) {}
