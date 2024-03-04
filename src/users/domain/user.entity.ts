import { BaseEntity } from 'src/core/domain/base.entity'

export class User extends BaseEntity {
  username: string
  lastName: string
  firstName: string
  email: string
  password: string
  isActive: boolean
}
