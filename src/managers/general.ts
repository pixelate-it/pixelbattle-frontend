import { GeneralState } from 'src/types/managers'
import createStore from 'unistore'
import { PaletteManager } from './palette'
import { AppRequests } from 'src/classes/AppRequests'
import { AppCanvas } from 'src/classes/AppCanvas'
import { InfoManager } from './info'
import { ProfileManager } from './profile'
import { TagsManager } from './tags'

export const GeneralStore = createStore<GeneralState>({
  canvasLoaded: false,
  infoLoaded: false
})

export const GeneralManager = {
  fetchCanvas() {
    AppRequests.pixels().then(async (v) => {
      AppCanvas.process(v)
      GeneralStore.setState({ canvasLoaded: true })
    })
  },

  async loadAll() {
    InfoManager.fetch()
    GeneralManager.fetchCanvas()
    PaletteManager.load()
    ProfileManager.load()
    ProfileManager.fetch()
    TagsManager.fetch()
  },

  reload() {
    ProfileManager.destroy()
    this.loadAll()
  }
}
