<template>
  <div :class="['card__side', { 'card--reverted': reverted }]">
    <div class="card__initial" v-text="getNameByInitialCard"/>
    <div class="card__type">
      <img :src="image" alt="">
    </div>
  </div>
</template>

<script>
  export default {
    name: "cardData",
    props: {
      initial: Number,
      image: String,
      reverted: {
        type: Boolean,
        default: () => false
      }
    },

    computed: {
      getNameByInitialCard () {
        switch (this.initial) {
          case 1:
            return 'A'
          case 11:
            return 'J'
          case 12:
            return 'Q'
          case 13:
            return 'K'
          default:
            return this.initial
        }
      }
    }
  }
</script>