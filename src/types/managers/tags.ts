import { FormattedTag } from '../api'

export interface TagsState {
  loaded: boolean
  tags: FormattedTag[]
  selectedTag: string
  isTagCreateOpened: boolean
}
