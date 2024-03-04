import { EntitySchemaColumnOptions } from 'typeorm'
import { BaseEntity } from './base.entity'

export const BaseSchema: Record<keyof BaseEntity, EntitySchemaColumnOptions> = {
  id: {
    primary: true,
    type: 'uuid',
    generated: 'uuid',
  },
  createdAt: {
    type: 'timestamp with time zone',
    createDate: true,
  },
  updatedAt: {
    type: 'timestamp with time zone',
    updateDate: true,
  },
  deletedAt: {
    type: 'timestamp',
    deleteDate: true,
    nullable: true,
  },
  deletedBy: {
    type: 'uuid',
    nullable: true,
  },
  updatedBy: {
    type: 'uuid',
    nullable: true,
  },
  createdBy: {
    type: 'uuid',
    nullable: true,
  },
} as const
