import { BottomBar } from './BottomBar'
import { SideBar } from './SideBar'
import { TitleBar } from './TitleBar'
import styles from './index.module.styl'
import { PaletteState } from '../../core/daemons/types.ts'
import { PaletteDaemon } from '../../core/daemons/palette.ts'
import {
  ComputedActions,
  useDaemonComputed
} from '../../hooks/util/useDaemonComputed.ts'

interface ComputedValues<T> extends ComputedActions<T> {
  color: (value: T) => string
}

export const Bars = () => {
  const [_, { color }] = useDaemonComputed<
    PaletteState,
    ComputedValues<NonNullable<PaletteState>>
  >(PaletteDaemon, {
    color: ({ selected }) => selected.toHex()
  })

  return (
    <>
      <div className={styles.wrapper}>
        <TitleBar />
        <SideBar />
        <BottomBar color={color} />
      </div>
    </>
  )
}
