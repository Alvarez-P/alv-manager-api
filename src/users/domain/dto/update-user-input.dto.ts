import { IsNotEmpty, IsEmail, Length } from 'class-validator'

export class UpdateUserInputDto {
  @IsNotEmpty({ message: 'El nombre de usuario es requerido.' })
  @Length(3, 30, {
    message: 'El nombre de usuario debe tener entre 3 y 30 caracteres.',
  })
  username!: string

  @IsNotEmpty({ message: 'El nombre es requerido.' })
  @Length(2, 50, {
    message: 'El nombre debe tener entre 3 y 50 caracteres.',
  })
  firstName!: string

  @IsNotEmpty({ message: 'El apellido es requerido.' })
  @Length(2, 50, {
    message: 'El apellido debe tener entre 2 y 50 caracteres.',
  })
  lastName!: string

  @IsNotEmpty({ message: 'El correo electrónico es requerido.' })
  @Length(5, 50, {
    message: 'El correo electrónico debe tener entre 5 y 50 caracteres.',
  })
  @IsEmail({}, { message: 'El correo electrónico es invalido.' })
  email!: string
}
