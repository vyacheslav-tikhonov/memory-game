<template>
  <div
    @click="onClick()"
    class="game-card">
    <Card
      v-show="show"
      :imageUrl="getImageUrl"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator';
import Card from '@/components/ui/cards/Card/Card.vue';

@Component({
  components: { Card },
})
export default class GameCard extends Vue {
  @Prop() private name!: string;
  @Prop() private show!: boolean;

  @Emit('click')
  private onClick() {
    return;
  }

  private get getImageUrl() {
    return require(`@/assets/pictures/${this.name}.webp`);
  } 

}

</script>

<style scoped lang="scss">
.game-card {
  background: gray;
  width: 100px;
  height: 100px;
}
</style>