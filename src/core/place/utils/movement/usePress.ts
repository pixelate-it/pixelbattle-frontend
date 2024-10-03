import { BasicPointerEvent } from '../../buses/types'
import { ClearEvent, DependenciesCallback } from '../types'
import { useClick } from './useClick'

export const usePress = (
  callback: ClearEvent<BasicPointerEvent>,
  delay: number,
  dependencies?: DependenciesCallback<BasicPointerEvent>
) => {
  let timeoutId: NodeJS.Timeout

  useClick(
    'start',
    (event) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        callback(event)
      }, delay)
    },
    dependencies
  )

  useClick(
    'end',
    () => {
      clearTimeout(timeoutId)
    },
    dependencies
  )
}
