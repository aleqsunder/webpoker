<template>
  <div class="app">
    <div class="app-desk" v-if="isLoaded">
      <template v-if="gameState">
        <div class="croupier">
          <Player :cards="croupier.cards" :bank="croupier.bank" :bet="croupier.bet" :is-croupier="true"/>
        </div>
        <div class="players">
          <Player :cards="player.cards" :bank="player.bank" :bet="player.bet" @create-new-game="() => startGame(true)"/>
        </div>
      </template>
      <template v-else>
        <div class="menu">
          <input class="menu__name" v-model="username" placeholder="Введите имя">
          <div class="menu__button" @click="startGame">
            Далее
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
  import Player from './Player/index'
  import { CARDS } from '../constants'

  export default {
    name: "index",
    components: { Player },

    data () {
      return {
        isLoaded: false,
        gameState: false,
        username: '',

        imagePrecache: [
          '/assets/backflip.jpg'
        ]
      }
    },

    methods: {
      startGame (edit = false) {
        this.generatePlayer(edit)
        this.generateCroupier()
        this.gameState = true
      },

      generatePlayer (edit = false) {
        let object = {}
        if (edit !== true) {
          object.username = this.username ?? `Игрок ${(Math.random() * 1000000).toString(16)}`
          object.bank = (Math.random() * 500 + 500) ^ 0
          object.bet = 0
        }

        object.cards = []

        for (let i = 0; i < 2; i++) {
          const card = this.generateCard()
          object.cards.push(card)
        }

        this.$store.dispatch('PlayersStore/setPlayer', object)
      },

      generateCroupier () {
        const username = 'Крупье'
        const bank = 0
        const cards = []

        for (let i = 0; i < 2; i++) {
          const card = this.generateCard(i > 0)
          cards.push(card)
        }

        this.$store.dispatch('PlayersStore/setCroupier', { username, cards, bet: 0, bank })
      },

      generateCard (hidden = false) {
        const initial = (Math.random() * 13 + 1) ^ 0
        const type = (Math.random() * CARDS.length + 1) ^ 0

        return { initial, type, hidden }
      },

      imagesLoaderPromise (url) {
        return new Promise(resolve => {
          const img = new Image()
          img.src = url
          img.onload = resolve
        })
      },

      async preloadImages () {
        let promises = []

        for (let url of this.imagePrecache) {
          promises.push(this.imagesLoaderPromise(url))
        }

        return await Promise.all(promises)
      }
    },

    computed: {
      player () {
        return this.$store.getters['PlayersStore/getPlayer']
      },

      croupier () {
        return this.$store.getters['PlayersStore/getCroupier']
      }
    },

    async mounted () {
      await this.preloadImages()
      this.isLoaded = true
    }
  }
</script>