import Color from 'src/core/classes/primitives/Color'

export interface GuiColorElement {
  normal: Color
  hover: Color
  press: Color
}

export const GuiColor: Record<string, GuiColorElement> = {
  Primary: {
    normal: new Color('#154cb7'),
    hover: new Color('#0f398d'),
    press: new Color('#0d2e71')
  },
  Danger: {
    normal: new Color('#f35151'),
    hover: new Color('#b13c3c'),
    press: new Color('#b13c3c')
  },
  Success: {
    normal: new Color('#7ad53e'),
    hover: new Color('#589c2a'),
    press: new Color('#589c2a')
  }
}
