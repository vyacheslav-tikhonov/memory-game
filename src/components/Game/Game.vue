<template>
  <div>
    <div v-show="isGameRunning">
      <Timer
        ref="timer"
      >
      </Timer>
    </div>
    <div v-show=!isGameRunning>
      <button
        @click="onStartGame()"
      >
        Start
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Ref } from 'vue-property-decorator';
import Timer from '@/components/Game/Timer/Timer.vue';

@Component({
  components: { Timer },
})
export default class Game extends Vue {
  @Ref('timer') readonly timer!: Timer;

  private isGameRunning = false;

  private onStartGame() {
    this.isGameRunning = true;
    this.timer.startTimer();
  }
}
</script>

<style scoped>
</style>