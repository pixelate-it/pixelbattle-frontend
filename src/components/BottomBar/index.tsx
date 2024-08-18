import { useEffect } from 'preact/compat'
import { useBuffer } from 'src/hooks/useBuffer'
import { BottomBarManager } from 'src/stores/bottombar'
import { BottomBarState } from 'src/types/stores/bottombar'
import { connect } from 'unistore/preact'

const BottomBar = (props: BottomBarState) => {
  const coordinates = useBuffer(props.coordinates)

  useEffect(() => {
    BottomBarManager.fetchPixel()
  }, [coordinates])

  return (
    <div style={{ position: 'absolute' }}>
      {props.info && (
        <div>
          {props.info.author}
          {props.info.tag && '#' + props.info.tag}
        </div>
      )}
      {props.coordinates[0]}, {props.coordinates[1]}
    </div>
  )
}

export default connect<object, object, BottomBarState, BottomBarState>([
  'coordinates',
  'info'
])((props) => <BottomBar {...props} />)
