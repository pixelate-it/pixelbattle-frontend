import createStore, { Listener } from 'unistore'
import { PaletteState } from './types'
import { LocalStorage } from '../classes/storage/local'
import { config } from 'src/config'
import Color from '../classes/primitives/Color'

export class PaletteDaemon {
  private static store = createStore<PaletteState>(
    config.defaults.colors.palette
  )

  public static get state(): PaletteState {
    return PaletteDaemon.store.getState()
  }

  static reset() {
    PaletteDaemon.setState(config.defaults.colors.palette)

    PaletteDaemon.save()
  }

  static setCurrentColor(color: Color) {
    PaletteDaemon.setState({ ...PaletteDaemon.state, selected: color })
    PaletteDaemon.save()
  }

  static removeColor(color: Color) {
    const palette = PaletteDaemon.state
    PaletteDaemon.setState({
      selected: palette.colors.at(-2) ?? palette.selected,
      colors: palette.colors.filter((c) => !c.equals(color))
    })

    PaletteDaemon.save()
  }

  static isDefaultColors() {
    return (
      PaletteDaemon.state.colors.length ===
      config.defaults.colors.palette.colors.length
    )
  }

  static isDefaultColor(color: Color) {
    return config.defaults.colors.palette.colors.some((c) => c.equals(color))
  }

  private static addColor(color: Color) {
    const palette = PaletteDaemon.state
    PaletteDaemon.setState({
      ...palette,
      colors: [...palette.colors, color]
    })

    PaletteDaemon.save()
  }

  static addAndSelect(color: Color) {
    const isColorInPalette = PaletteDaemon.state.colors.some((c) =>
      c.equals(color)
    )

    if (!isColorInPalette) {
      PaletteDaemon.addColor(color)
    }

    PaletteDaemon.setCurrentColor(color)

    PaletteDaemon.save()
  }

  static save() {
    const palette = PaletteDaemon.state
    LocalStorage.set(
      'palette',
      {
        colors: palette.colors,
        selected: palette.selected
      },
      ({ colors, selected }) =>
        JSON.stringify({
          colors: colors.map((color) => color.toHex()),
          selected: selected.toHex()
        })
    )
  }

  static load() {
    const palette = LocalStorage.get('palette', (flatPalette) => {
      return {
        colors: flatPalette.colors.map(
          (color) => new Color(color as unknown as string)
        ),
        selected: new Color(flatPalette.selected as unknown as string)
      }
    })

    if (!palette) return

    PaletteDaemon.setState(palette)
  }

  private static setState(state: Partial<PaletteState>) {
    PaletteDaemon.store.setState(
      state as Pick<PaletteState, keyof PaletteState>
    )
  }

  static on(f: Listener<PaletteState>) {
    PaletteDaemon.store.subscribe(f)
  }

  static off(f: Listener<PaletteState>) {
    PaletteDaemon.store.unsubscribe(f)
  }
}
