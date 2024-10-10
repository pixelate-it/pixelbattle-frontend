import { BasicPointerEvent } from '../../buses/types'
import { ClearEvent, DependenciesCallback } from '../types'
import { useClick, useGuarantiedClick } from './useClick'
import { useDragged } from './useDragged'

/**
 * Subs on press event
 * @param callback event accepter callback
 * @param delay in milliseconds
 * @param dependencies function with array like conditions
 */
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

  useDragged(({ current }) => {
    if (current) clearInterval(timeoutId)
  })

  useGuarantiedClick(() => {
    clearTimeout(timeoutId)
  }, dependencies)
}
