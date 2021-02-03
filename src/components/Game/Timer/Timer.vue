<template>
  <div class="timer">
    <div class="timer_time">
      {{ time }}
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { getHumanTimeFromSeconds } from '@/utils/time';

@Component({})
export default class Timer extends Vue {
  private timer = 0;
  private isRunning = false;

  private get time() {
    const time = getHumanTimeFromSeconds(this.timer);
    let result = '';
    if (time[0]) {
      result += `${time[0]} Days`;
    }
    if (time[1]) {
      result += `${time[1]} Hours `;
    }
    if (time[2]) {
      result += `${time[2]} Minuts `;
    }
    return result += `${time[3]} Seconds`;
  }

  public startTimer() {
    this.isRunning = true;
  }

  public stopTimer() {
    this.isRunning = false;
  }

  public clearTimer() {
    this.timer = 0;
  }

  public getTime(): number {
    return this.timer;
  }
  
  private mounted() {
    setInterval(() => {
      if (this.isRunning) {
        this.timer += 1;
      }
    }, 1000)
  }
}
</script>

<style scoped lang="scss">
.timer {
  &_time {
    color: #000;
    font-size: 14px;
  }
}
</style>