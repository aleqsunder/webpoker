<template>
  <div class="player-block">
    <template v-if="!isEnded">
      <template v-if="!isCroupier">
        <template v-if="betAccepted">
          <div class="player-controls">
            <div class="menu__button" v-if="counter < 21" @click="takeCard">
              Взять
            </div>
            <div class="menu__button" @click="accept">
              Закончить
            </div>
          </div>
        </template>
        <template v-else>
          <div class="player-controls">
            <div class="menu__button" @click="setBet(25)">25</div>
            <div class="menu__button" @click="setBet(50)">50</div>
            <div class="menu__button" @click="setBet(100)">100</div>
            <div class="menu__button" @click="setBet">All-in</div>
          </div>
          <div class="player-controls">
            <div class="menu__button" @click="saveBet">Принять</div>
          </div>
        </template>
      </template>
    </template>
    <template v-else>
      <template v-if="winner !== null">
        <div :class="['menu__button', winnerIs ? 'menu__button-green' : 'menu__button-red']" @click="startNewGame">
          {{ winnerIs ? 'Вы победили!' : 'Вы проиграли' }}
        </div>
      </template>
      <div class="player-controls">
        <div class="menu__button" @click="startNewGame">Повторить</div>
      </div>
    </template>
    <transition-group name="list" tag="div" class="player-block__cards">
      <Card v-for="(card, index) in cards" :key="index" :id="index" :initial="card.initial" :type="card.type" :hidden="card.hidden"/>
    </transition-group>
    <div class="player-block__info">
      <div class="player-block__info-background" v-if="!isCroupier">
        <div class="player-block__info-label">
          Банк
        </div>
        <div class="player-block__info-counter" v-text="bank"/>
      </div>
      <div class="player-block__info-background" v-if="!isCroupier">
        <div class="player-block__info-label">
          Ставка
        </div>
        <div class="player-block__info-counter" v-text="bet"/>
      </div>
      <div class="player-block__info-background">
        <div class="player-block__info-label">
          Счётчик
        </div>
        <div class="player-block__info-counter" v-text="counter"/>
      </div>
    </div>
  </div>
</template>

<script>
  import Card from '../Card/index'
  import { generateCard } from "../../additional"

  export default {
    name: "player-index",
    components: {Card},
    props: {
      cards: {
        type: Array,
        default: () => ([])
      },
      bank: Number,
      bet: Number,
      isCroupier: {
        type: Boolean,
        default: () => false
      }
    },
    emits: ['createNewGame'],

    data () {
      return {
        timeout: 400,
        betAccepted: false,
        winner: null,

        isEnded: false,
      }
    },

    methods: {
      startNewGame () {
        this.betAccepted = false
        this.$store.dispatch('PlayersStore/wipeCards')
        this.$emit('createNewGame')
        this.isEnded = false
      },

      takeCard () {
        this.$store.dispatch('PlayersStore/addCardToPlayer', { card: generateCard() })
      },

      accept () {
        this.$store.dispatch('PlayersStore/showCroupierCards')

        setTimeout(() => {
          if (this.isAvailableToTakeNextCard) {
            this.updateCroupierCounter()
          } else {
            this.showResult()
          }
        }, this.timeout)
      },

      showResult () {
        if (this.isCroupierWin) {
          this.winner = 'croupier'
        } else {
          this.winner = 'player'
          this.$store.dispatch('PlayersStore/changeBankValue', { value: this.bet * 2 })
        }

        this.$store.dispatch('PlayersStore/clearBet')
        this.isEnded = true
      },

      updateCroupierCounter () {
        this.$store.dispatch('PlayersStore/addCardToCroupier', { card: generateCard(true) })

        setTimeout(() => {
          this.$store.dispatch('PlayersStore/showCroupierCards')

          if (this.isAvailableToTakeNextCard) {
            setTimeout(() => {
              this.updateCroupierCounter()
            }, this.timeout)
          } else {
            this.showResult()
          }
        }, this.timeout)
      },

      setBet (bet) {
        if (typeof bet !== 'number') {
          bet = this.bank
        }
        if (bet > this.bank) {
          return false
        }

        this.$store.dispatch('PlayersStore/saveBet', { bet })
      },

      saveBet () {
        if (this.bet > 0) {
          this.betAccepted = true
        }
      }
    },

    computed: {
      counterPlayer () {
        return this.$store.getters[`PlayersStore/getPlayerCounter`]
      },

      counterCroupier () {
        return this.$store.getters[`PlayersStore/getCroupierCounter`]
      },

      counter () {
        return this.isCroupier ? this.counterCroupier : this.counterPlayer
      },

      differenceCounterToPlayer () {
        let diff = this.counterPlayer - 21
        return diff < 0 ? diff * -1 : diff
      },

      differenceCounterToCroupier () {
        let diff = this.counterCroupier - 21
        return diff < 0 ? diff * -1 : diff
      },

      isAvailableToTakeNextCard () {
        return this.counterCroupier < 21
            && this.counterCroupier < this.counterPlayer
            && this.differenceCounterToPlayer < this.differenceCounterToCroupier
      },

      isCroupierWin () {
        if (this.counterPlayer <= 21 && this.counterCroupier <= 21) {
          return this.counterCroupier >= this.counterPlayer
        } else if (this.counterPlayer > 21 && this.counterCroupier <= 21) {
          return true
        } else if (this.counterPlayer <= 21 && this.counterCroupier > 21) {
          return false
        } else {
          return this.differenceCounterToCroupier <= this.differenceCounterToPlayer
        }
      },

      winnerIs () {
        return (this.isCroupier && this.winner === 'croupier') || (!this.isCroupier && this.winner === 'player')
      }
    }
  }
</script>