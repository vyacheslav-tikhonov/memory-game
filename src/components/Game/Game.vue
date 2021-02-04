<template>
  <div class="game">
    <div class="nav">
      <router-link to="/leaders">Leaders</router-link>
    </div>
    <div class="game__buttons">
      <div v-if="!victory">
        <div v-show=!isGameRunning>
          <button
            @click="onStartGame()"
          >
            Start
          </button>
        </div>
        <div v-show=isGameRunning>
          <button
            @click="onPauseGame()"
          >
            Pause
          </button>
        </div>
      </div>
      <div v-if="victory">
        <button
          @click="onResetGame()"
        >
          New game
        </button>
      </div>
    </div>

    <div class="game__timer">
      <Timer ref="timer" />
    </div>

    <div v-if="victory">Victory!</div>

    <div
      class="cards"
    >
      <div
        v-for="(card, index) in cards"
        :key="index"
        class="card-container"
      >
        <GameCard
          v-if="card !== 0"
          :show="displayedIndexes.includes(index)"
          :name="card"
          @click="onClick(index)"
        />
      </div>
    </div>

  <div
    v-if="showLeadersDialog"
    class="game__leaders-dialog">
    <p>Save game in a leaders` table</p>
    <input v-model="gameName">
    <button @click="onSaveGame()">
      Save
    </button>
  </div>

  </div>
</template>

<script lang="ts">
import { Vue, Component, Ref } from 'vue-property-decorator';
import Timer from '@/components/Game/Timer/Timer.vue';
import GameCard from '@/components/ui/cards/GameCard/GameCard.vue';
import { shuffleArray } from '@/utils/array';
import { Leader } from './types';

@Component({
  components: { Timer, GameCard },
})
export default class Game extends Vue {
  @Ref('timer') readonly timer!: Timer;

  private isGameRunning = false;
  private isFreezing = true;
  private victory = false;
  private leadersPlace: number | null = null;
  private showLeadersDialog = false;
  private gameName = '';

  private displayedIndexes: number[] = []
  private currentElementIndex: number | null = null;
  private cardForHiding: null | {time: number; index: number} = null;

  private cards: number[] = [];

  private checkVictory() {
    return !this.cards.reduce((sum, current) => sum + current , 0);
  }

  private onResetGame() {
    this.initCards();
    this.timer.clearTimer();
    this.displayedIndexes = [];
    this.currentElementIndex = null;
    this.cardForHiding = null;
    this.victory = false;
    this.leadersPlace = null;
    this.showLeadersDialog = false;
    this.gameName = '';
  }

  private onStartGame() {
    this.isGameRunning = true;
    this.timer.startTimer();
    this.isFreezing = false;
  }

  private onPauseGame() {
    this.isGameRunning = false;
    this.cardForHiding = null;
    this.currentElementIndex = null;
    this.displayedIndexes = [];
    this.isFreezing = true;
    this.timer.stopTimer();
  }

  private onSaveGame() {
    this.showLeadersDialog = false;
    if (this.leadersPlace !== null) {
      let leaders: Leader[] = [];
      let leadersJson = localStorage.getItem('leaders');

      if (leadersJson) {
        leaders = JSON.parse(leadersJson);
      }

      const newLeaders = leaders.slice(0, this.leadersPlace);
      const time = this.timer.getTime();

      newLeaders.push({
        time,
        gameName: this.gameName,
      });
      newLeaders.concat(leaders.slice(this.leadersPlace));

      leadersJson = JSON.stringify(newLeaders.slice(0, 10));
      localStorage.setItem('leaders', leadersJson);
    }
  }

  private initCards() {
    const cards: number[] = [];
    for (let i = 1; i <= 18; i++) {
      cards.push(i, i);
    }

    this.cards = shuffleArray(cards);
  }

  private recordVictory() {
    this.victory = true;
    this.timer.stopTimer();

    const time = this.timer.getTime();

    const leadersPlace = this.checkLeadersPlace(time);
    if (leadersPlace < 10) {
      this.leadersPlace = leadersPlace;
      this.showLeadersDialog = true;
    }
  }

  private checkLeadersPlace(time: number) {
    const leadersJson = localStorage.getItem('leaders');
    if (leadersJson) {
      const leaders = JSON.parse(leadersJson);
      leaders.forEach((leader: Leader, index: number) => {
        if (time < leader.time) {
          return index;
        }
      });
      return leaders.length;
    }
    return 0;
  }

  private onClick(index: number) {
    if (this.isFreezing) {
      return
    }

    if (this.currentElementIndex !== null) {
      if (
        this.currentElementIndex !== index &&
        this.cards[this.currentElementIndex] === this.cards[index]
        ) {
        this.isFreezing = true;   
        this.displayedIndexes.push(index)
        setTimeout(() => { 
            if(this.currentElementIndex !== null) {
              this.cards[this.currentElementIndex] = 0
            }
            this.cards[index] = 0
            this.displayedIndexes = [];
            this.currentElementIndex = null;
            this.cardForHiding = null;
            this.isFreezing = false;
            if (this.checkVictory()) {
              this.recordVictory()
            }
          }
          , 1000);
      } else {
        this.isFreezing = true;
        this.displayedIndexes.push(index);
        setTimeout(() => { 
          this.currentElementIndex = null;
          this.displayedIndexes = [];
          this.cardForHiding = null;
          this.isFreezing = false;
          }
          , 500);
      }
    } else {
      this.currentElementIndex = index;
      this.displayedIndexes = [index];
      this.cardForHiding = {
        time: Date.now() + 3000,
        index,
      }
    }
  }

  private hideCard() {
    if (this.cardForHiding) {
      const time = Date.now()

      if (this.cardForHiding.time <= time) {
        this.displayedIndexes = [];
        this.currentElementIndex = null;
        this.cardForHiding = null;
      }
    }
  }

  private mounted() {
    this.initCards();
    setInterval(this.hideCard, 1000);
  }
}
</script>

<style scoped lang="scss">
.game {
  &__buttons {
    display: flex;
    gap: 10px;
    padding-bottom: 10px;
  }
  &__timer {
    padding: 20px 0;
  }
}

.nav {
  padding-bottom: 20px;
}

.cards {
  display: grid;
  grid-template-columns: repeat(6, 105px);
  grid-row-gap: 5px;
}

.card-container {
  width: 100px;
  height: 100px;
}
</style>