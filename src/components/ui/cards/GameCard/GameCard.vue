<template>
  <transition name="bounce">
    <div
      @click="onClick()"
      class="game-card"
      :class="{'game-card_clickable': clickable}"
    >
      <Card
        v-show="show"
        :imageUrl="getImageUrl"
      />
    </div>
  </transition>
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
  @Prop() private clickable!: boolean;

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
$base-color: #f0ecec;
$shine-color: rgb(255, 255, 255);

.game-card {
  border-radius: 3px;
  background: linear-gradient(90deg, $base-color 0px, $shine-color 40px, $base-color 80px);
  width: 100px;
  height: 100px;
  box-shadow: 1px 1px 2px #c6c6c6;

  &_clickable {
    cursor: pointer;
  }
} 

.bounce-enter-active {
  animation: bounce-in .5s;
}
.bounce-leave-active {
  animation: bounce-in .5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
</style>