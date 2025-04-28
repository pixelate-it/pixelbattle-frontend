import { Viewport } from 'src/core/storage'
import { BasicPointerEvent } from '../../buses'
import { ClearEvent, DependenciesCallback } from '../types'
import { useClick, useGuarantiedClick } from './useClick'
import { useMove } from './useMove'

export const usePressMove = (
  startCallback: ClearEvent<BasicPointerEvent>,
  moveCallback: ClearEvent<BasicPointerEvent>,
  endCallback: ClearEvent<Object>,
  dependencies?: DependenciesCallback<BasicPointerEvent>
) => {
  let pressed = false

  useClick(
    'start',
    (event) => {
      startCallback(event)
      pressed = true
      Viewport.locked = true
    },
    dependencies
  )

  useMove(
    (props) => {
      moveCallback(props)
      if (!Viewport.locked) Viewport.locked = true
    },
    (props) => [...(dependencies ? dependencies(props) : []), pressed]
  )

  useGuarantiedClick(() => {
    endCallback({})
    pressed = false
    Viewport.locked = false
  })
}
