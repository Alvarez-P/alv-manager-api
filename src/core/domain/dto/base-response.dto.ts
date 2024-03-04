import { BaseEntity } from '../base.entity'

export interface ItemListOutputDto<E extends BaseEntity> {
  total: number
  data: E[]
  take: number
  skip: number
}

export interface ItemOutputDto<E extends BaseEntity> {
  data: E | null
}

export interface GenericOutputDto<E extends BaseEntity> {
  message: string
  data?: E
}
