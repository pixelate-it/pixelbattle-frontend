import { mousePlugin } from './mouse'
import { touchScreenPlugin } from './touches'

export const movementPlugin = () => {
  mousePlugin()
  touchScreenPlugin()
}
