import {
  DeepPartial,
  DeleteResult,
  EntitySchema,
  FindManyOptions,
  FindOneOptions,
  FindOptionsOrder,
  FindOptionsWhere,
  Not,
  ObjectType,
  Repository,
  UpdateResult,
} from 'typeorm'
import { TransactionalRepository } from './unit-of-work/transactional.repository'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { IBaseRepository } from '../domain/base-repository.interface'
import { BaseEntity } from '../domain/base.entity'

export abstract class BaseRepository<E extends BaseEntity>
  implements IBaseRepository<E>
{
  protected repository: Repository<E>
  constructor(
    protected tr: TransactionalRepository,
    protected entity: ObjectType<E> | EntitySchema | string,
  ) {
    this.repository = tr.getRepository(entity)
  }

  public save(item: DeepPartial<E>): Promise<E> {
    const entity = this.repository.create(item)
    return this.repository.save(entity)
  }

  public updateOne(id: string, dataToUpdate: DeepPartial<E>): Promise<E> {
    return this.repository.save({ id, ...dataToUpdate })
  }

  public async deleteOne(
    id: string,
    deletedBy: string,
    softDelete = true,
  ): Promise<UpdateResult | DeleteResult> {
    if (softDelete) {
      const updateData = { deletedBy } as unknown as QueryDeepPartialEntity<E>
      await this.repository.update(id, updateData)
      return this.repository.softDelete(id)
    }
    return this.repository.delete(id)
  }

  public getOne(options?: FindOneOptions<E>): Promise<E | undefined> {
    return this.repository.findOne(options)
  }

  public getOptions<LABEL extends keyof E, VALUE extends keyof E>(options: {
    value: VALUE
    label: LABEL
    order?: FindOptionsOrder<E>
    skip?: number
    take?: number
    where?: FindOptionsWhere<E>
  }): Promise<({ [L in LABEL]: E[L] } & { [V in VALUE]: E[V] })[]> {
    return this.repository.find({
      ...options,
      select: [options.value, options.label],
    })
  }

  public getAll(options: FindManyOptions<E>): Promise<[any[], number]> {
    return this.repository.findAndCount(options)
  }

  public async isUnique<PK extends keyof E, T extends keyof E>({
    ignore,
    target,
    withDeleted = true,
  }: {
    ignore?: string
    target: { [k in Exclude<T, PK>]: E[k] }
    withDeleted?: boolean
  }): Promise<boolean> {
    const exists = await this.repository.findOne({
      where: {
        ...target,
        ...(ignore ? { id: Not(ignore) } : {}),
      } as FindOptionsWhere<E>,
      withDeleted,
    })
    return !exists
  }
}
