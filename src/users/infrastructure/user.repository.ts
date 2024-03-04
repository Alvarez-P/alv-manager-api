import { Injectable } from '@nestjs/common'
import { BaseRepository } from 'src/core/infrastructure/base.repository'
import { User } from '../domain/user.entity'
import { TransactionalRepository } from 'src/core/infrastructure/unit-of-work/transactional.repository'
import { ENTITY_NAMES } from 'src/core/constants'

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(protected tr: TransactionalRepository) {
    super(tr, ENTITY_NAMES.USERS)
  }
}
