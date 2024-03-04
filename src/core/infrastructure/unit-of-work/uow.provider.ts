import { Injectable, Scope } from '@nestjs/common'
import { DataSource, EntityManager, QueryRunner } from 'typeorm'

@Injectable({ scope: Scope.REQUEST })
export class UnitOfWork {
  private transactionManager: EntityManager | null
  protected queryRunner: QueryRunner

  constructor(private dataSource: DataSource) {
    this.queryRunner = this.dataSource.createQueryRunner()
    this.transactionManager = null
  }

  getTransactionManager(): EntityManager | null {
    return this.transactionManager || this.queryRunner.manager
  }

  getQueryRunner(): QueryRunner {
    return this.queryRunner
  }

  getConnection(): DataSource {
    return this.dataSource
  }

  async transactional<T>(work: () => T): Promise<T> {
    await this.queryRunner.startTransaction()
    this.transactionManager = this.queryRunner.manager
    let result: T
    try {
      result = await work()
      await this.queryRunner.commitTransaction()
    } catch (error) {
      await this.queryRunner.rollbackTransaction()
      throw error
    } finally {
      await this.queryRunner.release()
      this.transactionManager = null
    }
    return result
  }
}
