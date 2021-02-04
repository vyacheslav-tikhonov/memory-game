<template>
  <div class="leaders">
    <div class="nav">
      <router-link to="/">Game</router-link>
    </div>

    <div class="table">
      <div class="table__title">Leaders:</div>
      <div
        class="table__row"
        :key="index"
        v-for="(leader, index) in leaders"
      >
        <div>{{ leader.gameName }}</div>
        <div>{{ getTime(leader.time) }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { Leader } from '@/components/Game/types';
import { getHumanTimeFromSeconds } from '@/utils/time';

@Component
export default class Leaders extends Vue {
  private leaders: Leader[] = [];

  private getTime(seconds: number) {
    const time = getHumanTimeFromSeconds(seconds);
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

  private mounted() {
    const leadersJson = localStorage.getItem('leaders');
    if (leadersJson) {
      this.leaders = JSON.parse(leadersJson).sort();
    }
  }

}
</script>

<style scoped lang="scss">
.nav {
  padding-bottom: 20px;
}

.table {
  &__title {
    padding-bottom: 10px;
  }
  &__row {
    padding-bottom: 5px;
    display: flex;
    width: 300px;
    justify-content: space-between;
  }
}
</style>