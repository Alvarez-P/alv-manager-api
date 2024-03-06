import { createZodDto } from 'nestjs-zod/dto'
import { z } from 'nestjs-zod/z'
import {
  DateFilterSchema,
  JsonSchema,
  NullableBooleanFilterSchema,
  StringFilterSchema,
} from 'src/core/domain/dto/base-entity-filters.schema'
import { BaseQueryInputSchema } from 'src/core/domain/dto/base-query.dto'

const UserQueryInputSchema = z
  .object({
    orderBy: z
      .enum(['id', 'username', 'firstName', 'lastName', 'email', 'createdAt'], {
        errorMap: () => ({ message: 'El ordenamiento es inválido.' }),
      })
      .optional()
      .describe('OrderBy'),
    email: JsonSchema({
      schema: StringFilterSchema,
      label: 'el correo electrónico',
      strict: false,
    }).optional(),
    username: JsonSchema({
      schema: StringFilterSchema,
      label: 'el nombre de usuario',
      strict: false,
    }).optional(),
    firstName: JsonSchema({
      schema: StringFilterSchema,
      label: 'el nombre',
      strict: false,
    }).optional(),
    lastName: JsonSchema({
      schema: StringFilterSchema,
      label: 'el apellido',
      strict: false,
    }).optional(),
    createdAt: JsonSchema({
      schema: DateFilterSchema('la fecha de creación'),
      label: 'la fecha de creación',
    }).optional(),
    isActive: JsonSchema({
      schema: NullableBooleanFilterSchema,
      label: 'la fecha de creación',
    }).optional(),
  })
  .and(BaseQueryInputSchema)

export class UserQueryInputDto extends createZodDto(UserQueryInputSchema) {}
