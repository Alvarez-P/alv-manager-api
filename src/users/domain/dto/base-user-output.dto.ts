import { Exclude } from 'class-transformer'
import { User } from '../user.entity'

export class UserOutputDto extends User {
  id: string
  firstName: string
  lastName: string
  email: string
  username: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  createdBy: string | null
  updatedBy: string

  @Exclude()
  password: string
  @Exclude()
  deletedAt: Date | null
  @Exclude()
  deletedBy: string | null
}
