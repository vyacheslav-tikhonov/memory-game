<template>
  <div class="game">
    <div class="game__buttons">
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
      <div>
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

  </div>
</template>

<script lang="ts">
import { Vue, Component, Ref } from 'vue-property-decorator';
import Timer from '@/components/Game/Timer/Timer.vue';
import GameCard from '@/components/ui/cards/GameCard/GameCard.vue';
import { shuffleArray } from '@/utils/array';

@Component({
  components: { Timer, GameCard },
})
export default class Game extends Vue {
  @Ref('timer') readonly timer!: Timer;

  private isGameRunning = false;
  private isFreezing = true;

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

  private initCards() {
    const cards: number[] = [];
    for (let i = 1; i <= 18; i++) {
      cards.push(i, i);
    }

    this.cards = shuffleArray(cards);
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
              this.timer.stopTimer();
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