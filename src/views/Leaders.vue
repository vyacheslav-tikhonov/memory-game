<template>
  <div>
    <router-link to="/">Game</router-link>
    <div>
      Leaders:
    </div>
    <div
      :key="index"
      v-for="(leader, index) in leaders"
    >
      {{ leader.gameName }} {{ getTime(leader.time) }}
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
      this.leaders = JSON.parse(leadersJson);
    }
  }

}
</script>