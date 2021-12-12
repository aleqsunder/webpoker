<template>
  <div :class="['card__wrapper', { 'card__wrapper-hidden': hidden }]">
    <div class="card">
      <card-data :initial="initialValue" :image="image"/>
      <img class="card__image-logo" :src="image" alt="">
      <card-data :initial="initialValue" :image="image" :reverted="true"/>
    </div>
    <div class="card card--reversed"/>
  </div>
</template>

<script>
  import cardData from "./cardData"
  import { CARDS } from "../../constants"

  export default {
    name: "card-index",
    components: {cardData},
    props: {
      id: Number,
      initial: Number,
      type: Number,
      hidden: Boolean,
    },

    methods: {
      swapStateOfCard () {
        this.$store.dispatch('PlayersStore/changeStateOfHiddenCard', this.id)
      }
    },

    computed: {
      image () {
        return !this.hidden ? `assets/${CARDS[this.type - 1]}.svg` : `assets/club.svg`
      },

      initialValue () {
        return !this.hidden ? this.initial : 0
      },
    }
  }
</script>