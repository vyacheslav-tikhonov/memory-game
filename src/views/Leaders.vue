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
import { modifyHumanTimeToString } from '@/utils/time';

@Component
export default class Leaders extends Vue {
  private leaders: Leader[] = [];

  private getTime(seconds: number): string {
    return modifyHumanTimeToString(seconds);
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