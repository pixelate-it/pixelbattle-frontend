import styles from './index.module.css'
import { PaletteGroup } from './PaletteGroup'
import { ColorSelect } from './ColorSelect'
import { usePalette } from 'src/hooks/usePalette'
import { ColorPick } from './ColorPick'
import { ColorDelete } from './ColorDelete'
import { ColorCreate } from './ColorCreate'

export const Palette = () => {
  const palette = usePalette()

  return (
    <div className={styles.palette}>
      <PaletteGroup>
        {palette.colors.map((color) => (
          <ColorSelect color={color} selected={palette.selected} />
        ))}
      </PaletteGroup>
      <hr className={styles.hr} />
      <PaletteGroup>
        <ColorPick />
        <ColorDelete />
        <ColorCreate />
      </PaletteGroup>
    </div>
  )
}
