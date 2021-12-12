import { getCardInitialByRules } from "../additional"

export default {
  namespaced: true,

  state () {
    return {
      player: {},
      croupier: {}
    }
  },

  actions: {
    setPlayer: ({ commit }, data) => commit('setPlayer', data),
    addCardToPlayer: ({ commit }, data) => commit('addCardToPlayer', data),
    changeStateOfHiddenCard: ({ commit }, data) => commit('changeStateOfHiddenCard', data),
    saveBet: ({ commit }, data) => commit('saveBet', data),
    clearBet: ({ commit }) => commit('clearBet'),
    changeBankValue: ({ commit }, data) => commit('changeBankValue', data),

    setCroupier: ({ commit }, data) => commit('setCroupier', data),
    addCardToCroupier: ({ commit }, data) => commit('addCardToCroupier', data),
    showCroupierCards: ({ commit }) => commit('showCroupierCards'),

    wipeCards: ({ commit }) => {
      commit('wipePlayerCards')
      commit('wipeCroupierCards')
    },
  },

  mutations: {
    setPlayer (state, data) {
      state.player = { ...state.player, ...data }
    },

    addCardToPlayer (state, data) {
      const { card } = data
      state.player.cards.push(card)
    },

    showCroupierCards (state) {
      state.croupier.cards = state.croupier.cards.map(item => {
        item.hidden = false
        return item
      })
    },

    changeStateOfHiddenCard (state, id) {
      state.croupier.cards[id].hidden = !state.croupier.cards[id].hidden
    },

    setCroupier (state, data) {
      state.croupier = data
    },

    addCardToCroupier (state, data) {
      const { card } = data
      state.croupier.cards.push(card)
    },

    saveBet (state, data) {
      const { bet } = data
      state.player.bank -= bet
      state.player.bet += bet
    },

    clearBet (state) {
      state.player.bet = 0
    },

    changeBankValue (state, data) {
      const { value } = data
      state.player.bank += value
      state.player.bet = 0
    },

    setDataToPlayer (state, data) {
      state.player = { ...state.player, ...data }
    },

    wipePlayerCards (state) {
      state.player.cards = []
    },

    wipeCroupierCards (state) {
      state.croupier.cards = []
    }
  },

  getters: {
    getPlayer: state => state.player,
    getPlayerCounter: state => {
      if (state.player.cards.length > 0) {
        return state.player.cards.reduce((a, i) => (a += getCardInitialByRules(a, i.initial), a), 0)
      }

      return 0
    },

    getCroupier: state => state.croupier,
    getCroupierCounter: state => {
      if (state.croupier.cards.length > 0) {
        return state.croupier.cards.reduce((a, i) => i.hidden ? a : (a += getCardInitialByRules(a, i.initial), a), 0)
      }

      return 0
    },
  }
}