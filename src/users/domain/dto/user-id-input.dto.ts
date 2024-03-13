import { createZodDto } from 'nestjs-zod/dto'
import { z } from 'nestjs-zod/z'

const UserIdInputSchema = z.object({
  id: z
    .string({
      required_error: 'El identificador del usuario es requerido.',
    })
    .uuid('El identificador del usuario es inválido.')
    .describe('Identificador del usuario'),
})

export class UserIdInputDto extends createZodDto(UserIdInputSchema) {}
