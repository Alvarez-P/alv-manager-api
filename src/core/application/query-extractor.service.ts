import { Injectable } from '@nestjs/common'
import { BaseEntity } from '../domain/base.entity'
import {
  BaseQuery,
  QueryOrder,
  QueryPagination,
  SortBy,
} from '../domain/types/base-query.types'
import { EntityQueryFilters } from '../domain/types/entity-filters.types'

@Injectable()
export class QueryExtractorService<E extends BaseEntity> {
  private orderBy: keyof E = 'createdAt'
  private sortBy: SortBy = 'DESC'
  private take = 20
  private skip = 0
  constructor() {}

  setDefaults({
    orderBy,
    sortBy,
    take,
    skip,
  }: {
    orderBy?: keyof E
    sortBy?: SortBy
    take?: number
    skip?: number
  }): QueryExtractorService<E> {
    this.orderBy = orderBy ?? this.orderBy
    this.sortBy = sortBy ?? this.sortBy
    this.take = take ?? this.take
    this.skip = skip ?? this.skip
    return this
  }

  extract<Q extends BaseQuery<E>>(
    query: Q & EntityQueryFilters<E>,
  ): {
    pagination: Required<QueryPagination>
    order: Required<QueryOrder<E>>
    filters: EntityQueryFilters<E>
  } {
    const { orderBy, sortBy, take, skip, ...filters } = query
    const pagination = { take: take ?? this.take, skip: skip ?? this.skip }
    const order = {
      orderBy: orderBy ?? this.orderBy,
      sortBy: sortBy ?? this.sortBy,
    }
    return { pagination, order, filters: filters as EntityQueryFilters<E> }
  }
}
