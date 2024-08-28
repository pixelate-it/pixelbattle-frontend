import { AppRequests } from 'src/classes/AppRequests'
import { InfoState } from 'src/types/managers/info'
import createStore from 'unistore'

export const InfoStore = createStore<InfoState>({
  name: 'Загрузка...',
  ended: true,
  cooldown: Infinity,
  online: 0,
  canvas: {
    width: -Infinity,
    height: -Infinity
  }
})

export const InfoManager = {
  async fetch() {
    AppRequests.info().then((info) => InfoStore.setState(info))
  }
}
