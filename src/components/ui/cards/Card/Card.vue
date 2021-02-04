<template>
  <div
      class="card"
    >
    <img
      alt=""
      :src="imageUrl"
      class="card__image"
    >
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop} from 'vue-property-decorator';

@Component
export default class Card extends Vue {
  @Prop() private imageUrl!: number;
}

</script>

<style scoped lang="scss">
.card {
  &__image {
    width: 100px;
    height: 100px;
  }
}
</style>