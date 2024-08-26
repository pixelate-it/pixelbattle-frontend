import { FormattedTag } from '../api'

export interface TagsState {
  tags: FormattedTag[]
  selectedTag: string
  isTagCreateOpened: boolean
}
