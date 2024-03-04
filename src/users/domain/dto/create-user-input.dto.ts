import { createZodDto } from 'nestjs-zod/dto'
import { z } from 'nestjs-zod/z'

const pwdErrorMessage = {
  message:
    'La contraseña debe tener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial.',
} as const

const CreateUserInputSchema = z.object({
  username: z
    .string({ required_error: 'El nombre de usuario es requerido.' })
    .min(3, {
      message: 'El nombre de usuario debe tener entre 3 y 30 caracteres.',
    })
    .max(30, {
      message: 'El nombre de usuario debe tener entre 3 y 30 caracteres.',
    })
    .describe('Username'),
  password: z
    .password({
      required_error: 'La contraseña es requerida.',
    })
    .min(8, { message: 'La contraseña debe tener entre 8 y 20 caracteres.' })
    .max(20, { message: 'La contraseña debe tener entre 8 y 20 caracteres.' })
    .atLeastOne('digit', pwdErrorMessage)
    .atLeastOne('lowercase', pwdErrorMessage)
    .atLeastOne('uppercase', pwdErrorMessage)
    .atLeastOne('special', pwdErrorMessage)
    .describe('Password'),
  firstName: z
    .string({ required_error: 'El nombre es requerido.' })
    .min(2, { message: 'El nombre debe tener entre 2 y 50 caracteres.' })
    .max(50, { message: 'El nombre debe tener entre 2 y 50 caracteres.' })
    .describe('First Name'),
  lastName: z
    .string({ required_error: 'El apellido es requerido.' })
    .min(2, { message: 'El apellido debe tener entre 2 y 50 caracteres.' })
    .max(50, {
      message: 'El apellido debe tener entre 2 y 50 caracteres.',
    })
    .describe('Last Name'),
  email: z
    .string({ required_error: 'El correo electrónico es requerido.' })
    .email({ message: 'El correo electrónico es invalido.' })
    .min(5)
    .max(50)
    .describe('Email'),
})

export class CreateUserInputDto extends createZodDto(CreateUserInputSchema) {}
