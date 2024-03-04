export class BaseEntity {
  id: string
  createdAt: Date
  updatedAt: Date | null
  deletedAt: Date | null
  createdBy: string | null
  updatedBy: string | null
  deletedBy: string | null
}
