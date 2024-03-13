import * as path from 'path'

export const ENTITY_NAMES = {
  USERS: 'users',
} as const

export const EVENT_TARGETS = {
  ...ENTITY_NAMES,
  USER_PROFILE_PICTURE: 'user-profile-picture',
} as const

export const ENTITY_ACTIONS = {
  CREATED: 'created',
  UPDATED: 'updated',
  DELETED: 'deleted',
} as const

export const TEMP_FILES_FOLDER = path.join(process.cwd(), 'files', 'temp')

export const FILES_FOLDER = path.join(process.cwd(), 'files')
