import { EntitySchema } from 'typeorm'
import { User } from './user.entity'
import { ENTITY_NAMES } from 'src/core/constants'
import { BaseSchema } from 'src/core/domain/base.schema'

export const UserSchema = new EntitySchema<User>({
  name: ENTITY_NAMES.USERS,
  tableName: ENTITY_NAMES.USERS,
  target: User,
  columns: {
    username: {
      type: String,
      nullable: false,
      unique: true,
      length: 30,
    },
    email: {
      type: String,
      nullable: false,
      unique: true,
      length: 50,
    },
    firstName: {
      type: String,
      nullable: false,
      length: 50,
    },
    lastName: {
      type: String,
      nullable: false,
      length: 50,
    },
    password: {
      type: String,
      nullable: true,
      length: 200,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    profilePicture: {
      type: String,
      nullable: true,
      default: null,
    },
    ...BaseSchema,
  },
  relations: {},
})
