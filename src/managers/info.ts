import { AppRequests } from 'src/classes/AppRequests'
import { InfoState } from 'src/types/managers/info'
import createStore from 'unistore'

export const InfoStore = createStore<InfoState>(null)

export const InfoManager = {
  async fetch() {
    const info = await AppRequests.info()

    InfoStore.setState({ ...info })
  }
}
