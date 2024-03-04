import {
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  FindOptionsOrder,
  FindOptionsWhere,
  UpdateResult,
} from 'typeorm'
import { BaseEntity } from './base.entity'

export interface IBaseRepository<E extends BaseEntity> {
  save(item: E): Promise<E>
  updateOne(id: string, dataToUpdate: E): Promise<E>
  deleteOne(
    id: string,
    deletedBy: string,
    softDelete?: boolean,
  ): Promise<UpdateResult | DeleteResult>
  getOne(options?: FindOneOptions<E>): Promise<E | undefined>
  getAll(options: FindManyOptions<E>): Promise<[any[], number]>
  getOptions<LABEL extends keyof E, VALUE extends keyof E>(options: {
    value: VALUE
    label: LABEL
    order?: FindOptionsOrder<E>
    skip?: number
    take?: number
    where?: FindOptionsWhere<E>
  }): Promise<({ [L in LABEL]: E[L] } & { [V in VALUE]: E[V] })[]>
  isUnique<PK extends keyof E, T extends keyof E>(options: {
    ignore?: string
    target: { [k in Exclude<T, PK>]: E[k] }
    checkDeleted?: boolean
  }): Promise<boolean>
}
