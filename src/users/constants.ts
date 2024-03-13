import * as path from 'path'
import { ENTITY_ACTIONS, EVENT_TARGETS, FILES_FOLDER } from 'src/core/constants'

export const USER_PROVIDER_TOKENS = {
  REPOSITORY: Symbol.for('UserRepository'),
  SERVICE: Symbol.for('UserService'),
  EVENTS: Symbol.for('UserEventsService'),
}

export const USER_CREATED_EVENT = `${EVENT_TARGETS.USERS}.${ENTITY_ACTIONS.CREATED}`
export const USER_UPDATED_EVENT = `${EVENT_TARGETS.USERS}.${ENTITY_ACTIONS.UPDATED}`
export const USER_DELETED_EVENT = `${EVENT_TARGETS.USERS}.${ENTITY_ACTIONS.DELETED}`
export const USER_UPDATED_PROFILE_PICTURE_EVENT = `${EVENT_TARGETS.USER_PROFILE_PICTURE}.${ENTITY_ACTIONS.UPDATED}`

export const getUserFilesPath = (id: string) =>
  path.join(FILES_FOLDER, 'users', id)

export const USER_FILE_NAMES = {
  PROFILE_PICTURE: 'profile',
}
