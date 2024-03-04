import { Module, Global } from '@nestjs/common'
import { TransactionalRepository } from './infrastructure/unit-of-work/transactional.repository'
import { UnitOfWork } from './infrastructure/unit-of-work/uow.provider'

@Global()
@Module({
  providers: [UnitOfWork, TransactionalRepository],
  exports: [UnitOfWork, TransactionalRepository],
})
export class UnitOfWorkModule {}
