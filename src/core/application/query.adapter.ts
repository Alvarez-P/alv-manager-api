import { Injectable } from '@nestjs/common'
import {
  And,
  FindManyOptions,
  FindOneOptions,
  FindOptionsOrder,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  In,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Not,
  ILike,
} from 'typeorm'
import {
  EF,
  EntityQueryFilters,
  isArray,
  isObject,
} from '../domain/types/entity-filters.types'
import { BaseEntity } from '../domain/base.entity'
import { SortBy } from '../domain/types/base-query.types'

@Injectable()
export class QueryORMAdapter<E extends BaseEntity> {
  #queryFilters: FindManyOptions<E> = {}

  private filterMap = {
    $contains: (v: string) => ILike(`%${v}%`),
    $notContains: (v: string) => Not(ILike(`%${v}%`)),
    $in: (v: any[]) => In(v),
    $notIn: (v: any[]) => Not(In(v)),
    $not: (v: boolean) => Not(v),
    $gt: (v: number) => MoreThan(v),
    $lt: (v: number) => LessThan(v),
    $gte: (v: number) => MoreThanOrEqual(v),
    $lte: (v: number) => LessThanOrEqual(v),
  }
  constructor() {
    this.#queryFilters = {
      order: { createdAt: 'ASC' } as FindOptionsOrder<E>,
      skip: 0,
      take: 0,
      withDeleted: false,
    }
  }

  public addWhere(filters: EntityQueryFilters<E>): QueryORMAdapter<E> {
    let where: FindOptionsWhere<E> | FindOptionsWhere<E>[] = {}
    if (isArray(filters)) {
      where = filters.map((filter) => this.addFilter(filter))
    } else where = this.addFilter(filters)
    this.#queryFilters = { ...this.#queryFilters, where }
    return this
  }
  private addFilter(filters: EF<E>): FindOptionsWhere<E> {
    const entries = Object.entries(filters)
    const parsedFilters: FindOptionsWhere<E> = {}
    entries.forEach(([key, value]) => {
      if (value === undefined) return
      if (isArray(value)) {
        parsedFilters[key] = In(value)
        return
      }
      if (isObject(value)) {
        const deepFilters = Object.entries(value)
        if (deepFilters.length === 1) {
          const [deepKey, deepValue] = deepFilters[0]
          if (!deepKey.startsWith('$')) return
          const parser = this.filterMap[deepKey]
          if (parser) parsedFilters[key] = parser(deepValue)
          return
        }
        const filter = []
        deepFilters.forEach(([deepKey, deepValue]) => {
          if (!deepKey.startsWith('$')) return
          const parser = this.filterMap[deepKey]
          if (parser) filter.push(parser(deepValue))
        })
        parsedFilters[key] = And(...filter)
        return
      }
      parsedFilters[key] = value
    })
    return parsedFilters
  }

  public addRelations(relations: Record<string, boolean>): QueryORMAdapter<E> {
    this.#queryFilters = {
      ...this.#queryFilters,
      relations: { ...relations } as FindOptionsRelations<E>,
    }
    return this
  }
  public addSelect(select: Record<string, boolean>): QueryORMAdapter<E> {
    this.#queryFilters = {
      ...this.#queryFilters,
      select: { ...select } as FindOptionsSelect<E>,
    }
    return this
  }
  public includeDeleted(): QueryORMAdapter<E> {
    this.#queryFilters = { ...this.#queryFilters, withDeleted: true }
    return this
  }
  public addPagination(
    skip: number | undefined,
    take: number | undefined,
  ): QueryORMAdapter<E> {
    this.#queryFilters = { ...this.#queryFilters, skip, take }
    return this
  }
  public addOrderAndSort(orderBy: keyof E, sortBy: SortBy): QueryORMAdapter<E> {
    this.#queryFilters = {
      ...this.#queryFilters,
      order: { [orderBy]: sortBy } as FindOptionsOrder<E>,
    }
    return this
  }

  public buildQueryOne(): FindOneOptions<E> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { skip, take, ...queryOneFilters } = this.#queryFilters
    return queryOneFilters
  }
  public buildQueryMany(): FindManyOptions<E> {
    return this.#queryFilters
  }
}
