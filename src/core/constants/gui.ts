import { OverlaysDaemon } from '../daemons/overlays'
import { gui } from '../place'
import { IconsType } from '../place/webgl'
import { Vector } from '../util/vector'
import { Viewport } from '../storage'
import { GuiButton } from '../place/gui'

const overlayButtonSize = 5

const makeButtonsFromList = (
  buttonsMargin: number,
  buttonsSize: number,
  list: Array<[IconsType, () => void | null, gui.GuiColorElement]>
): Array<gui.GuiButton> =>
  list.map(
    (e, i) =>
      new gui.GuiButton(
        i * buttonsMargin,
        0,
        buttonsSize,
        buttonsSize,
        e[1],
        e[0],
        e[2]
      )
  )

export const guiContainers: () => Array<gui.GuiContainer> = () => [
  new gui.GuiContainer(
    0,
    0,
    [
      new gui.GuiOverlay(),
      ...makeButtonsFromList(6, overlayButtonSize, [
        [
          IconsType.ARROW_LEFT,
          () => {
            OverlaysDaemon.prevOverlay()
            const overlay = OverlaysDaemon.currentOverlay
            Viewport.focusOn(new Vector(overlay.x, overlay.y), overlay.size)
          },
          gui.GuiColor.Primary
        ],
        [
          IconsType.ARROW_RIGHT,
          () => {
            OverlaysDaemon.nextOverlay()
            const overlay = OverlaysDaemon.currentOverlay
            Viewport.focusOn(new Vector(overlay.x, overlay.y), overlay.size)
          },
          gui.GuiColor.Primary
        ],
        [
          IconsType.CROSS,
          () => {
            OverlaysDaemon.toggleOverlayGui(false)
          },
          gui.GuiColor.Danger
        ]
      ])
    ],
    function () {
      const i = () => {
        if (OverlaysDaemon.empty) {
          for (const i of this.elements) {
            if (i instanceof GuiButton) {
            }
          }
        }
        const overlay = OverlaysDaemon.currentOverlay
        this.x = overlay.x
        this.y = overlay.y - overlayButtonSize - 2
        ;(this.elements[0] as gui.GuiOverlay).resize(
          overlay.size.x,
          overlay.size.y
        )
      }
      OverlaysDaemon.on(i)
      i()
    }
  )
]
