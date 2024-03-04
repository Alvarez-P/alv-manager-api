import { Injectable, Scope } from '@nestjs/common'
import { Repository, EntitySchema, ObjectType } from 'typeorm'
import { UnitOfWork } from './uow.provider'
import { BaseEntity } from 'src/core/domain/base.entity'

@Injectable({ scope: Scope.REQUEST })
export class TransactionalRepository {
  constructor(private uow: UnitOfWork) {}

  getRepository<E extends BaseEntity>(
    target: ObjectType<E> | EntitySchema<E> | string,
  ): Repository<E> {
    const transactionManager = this.uow.getConnection()
    return transactionManager.getRepository<E>(target)
  }
}
