import { BaseEntity } from '../base.entity'

export declare type SortBy = 'ASC' | 'DESC' | 'asc' | 'desc'

export interface QueryPagination {
  readonly take?: number
  readonly skip?: number
}

export interface QueryOrder<T extends BaseEntity> {
  readonly sortBy?: SortBy
  readonly orderBy?: keyof T
}

export interface BaseQuery<T extends BaseEntity>
  extends QueryPagination,
    QueryOrder<T> {}
