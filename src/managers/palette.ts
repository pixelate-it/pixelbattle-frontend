import { AppColor } from 'src/classes/AppCanvas/AppColor'
import { AppConfig } from 'src/classes/AppConfig'
import { AppLocalStorage } from 'src/classes/AppLocalStorage'
import { PaletteState } from 'src/types/managers/palette'
import createStore from 'unistore'

export const PaletteStore = createStore<PaletteState>(
  AppConfig.defaults.colors.palette
)

export const PaletteManager = {
  reset() {
    PaletteStore.setState(AppConfig.defaults.colors.palette)

    PaletteManager.save()
  },
  setCurrentColor: (color: AppColor) => {
    PaletteStore.setState({ ...PaletteStore.getState(), selected: color })
    PaletteManager.save()
  },
  removeColor(color: AppColor) {
    const palette = PaletteStore.getState()
    PaletteStore.setState({
      selected: palette.colors.at(-2) ?? palette.selected,
      colors: palette.colors.filter((c) => !c.equals(color))
    })

    PaletteManager.save()
  },
  isDefaultColor(color: AppColor) {
    return AppConfig.defaults.colors.palette.colors.some((c) => c.equals(color))
  },
  addColor(color: AppColor) {
    const palette = PaletteStore.getState()
    PaletteStore.setState({
      ...palette,
      colors: [...palette.colors, color]
    })

    PaletteManager.save()
  },
  addAndSelect(color: AppColor) {
    const isColorInPalette = PaletteStore.getState().colors.some((c) =>
      c.equals(color)
    )

    if (!isColorInPalette) {
      this.addColor(color)
    }

    this.setCurrentColor(color)

    PaletteManager.save()
  },
  save() {
    const palette = PaletteStore.getState()
    AppLocalStorage.set(
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
  },
  load() {
    const palette = AppLocalStorage.get('palette', (flatPalette) => {
      return {
        colors: flatPalette.colors.map(
          (color) => new AppColor(color as unknown as string)
        ),
        selected: new AppColor(flatPalette.selected as unknown as string)
      }
    })

    if (!palette) return

    PaletteStore.setState(palette)
  }
}
