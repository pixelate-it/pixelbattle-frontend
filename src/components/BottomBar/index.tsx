import { useEffect } from 'preact/compat'
import { useBuffer } from 'src/hooks/useBuffer'
import { useStoreSelector } from 'src/hooks/useStoreSelector'
import { BottomBarManager, CanvasStore } from 'src/stores/canvas'
import { PixelInfo } from 'src/types/api'
import { CanvasState } from 'src/types/stores'

interface BottomBarProps {
  pointerCoordinates: number[]
  pixelInfo: PixelInfo | null
}

export const BottomBar = () => {
  const state = useStoreSelector<CanvasState, BottomBarProps>(CanvasStore, [
    'pointerCoordinates',
    'pixelInfo'
  ])
  const coordinates = useBuffer(state.pointerCoordinates)

  useEffect(() => {
    BottomBarManager.fetchPixel()
  }, [coordinates])

  return (
    <div style={{ position: 'absolute' }}>
      {state.pixelInfo && (
        <div>
          {state.pixelInfo.author}
          {state.pixelInfo.tag && '#' + state.pixelInfo.tag}
        </div>
      )}
      {state.pointerCoordinates[0]}, {state.pointerCoordinates[1]}
    </div>
  )
}
