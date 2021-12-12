import { createApp } from "vue"
import { createStore } from "vuex"

import Index from './components/index'
import PlayersStore from "./store/players"

const store = createStore({
  modules: {
    PlayersStore
  }
})

const webpoker = createApp(Index)
webpoker.use(store)
webpoker.mount('#root')