import { HttpException, HttpStatus } from '@nestjs/common'

export class UserNotFoundException extends HttpException {
  constructor() {
    super('No se encontró el usuario.', HttpStatus.BAD_REQUEST)
  }
}

export class EmailAlreadyUsedException extends HttpException {
  constructor() {
    super('El email ya se encuentra registrado.', HttpStatus.BAD_REQUEST)
  }
}

export class UsernameAlreadyUsedException extends HttpException {
  constructor() {
    super(
      'El nombre de usuario ya se encuentra registrado.',
      HttpStatus.BAD_REQUEST,
    )
  }
}

export class UserIsDisabledException extends HttpException {
  constructor() {
    super('El usuario esta deshabilitado.', HttpStatus.BAD_REQUEST)
  }
}
