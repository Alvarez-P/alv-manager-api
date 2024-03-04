import { BaseEntity } from '../base.entity'

export type BaseEntityFilter<T> = { $not?: T | null } | T | null
export type ExtendedTypeFilter<T> = {
  $gte?: T
  $lte?: T
  $not?: T
  $in?: (T | null)[]
  $notIn?: (T | null)[]
} & BaseEntityFilter<T>

export type EntityStringFilter = {
  $notContains?: string
  $contains?: string
  $in?: (string | null)[]
  $notIn?: (string | null)[]
} & BaseEntityFilter<string>

export type EF<E extends BaseEntity> = {
  [K in keyof E]?: E[K] extends Date
    ? ExtendedTypeFilter<Date>
    : E[K] extends number
    ? ExtendedTypeFilter<number>
    : E[K] extends string
    ? EntityStringFilter
    : E[K] extends boolean
    ? BaseEntityFilter<boolean>
    : E[K] extends null
    ? BaseEntityFilter<null>
    : E[K]
}

export type EntityQueryFilters<E extends BaseEntity> = EF<E> | EF<E>[]

export const isObject = (value: any): value is Record<string, any> =>
  Object.prototype.toString.call(value) === '[object Object]'

export const isArray = (value: any): value is any[] =>
  Object.prototype.toString.call(value) === '[object Array]'
