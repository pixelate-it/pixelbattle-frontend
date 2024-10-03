import { mousePlugin } from './mouse'

export const movementPlugin = () => {
  let canDrag = true
  mousePlugin(canDrag)
}
